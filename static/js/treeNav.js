// Keep the page tree's expanded branches across navigations, animate
// category changes with a measured height (Docusaurus-style dynamic duration),
// and, when a sidebar link is followed, animate from the previous page's tree
// state to the new one so the old branch collapses while the new one expands.
// Set params.treenav.autoCollapse = false to keep every opened branch open.
// Set treenav.collapse in a page's front matter to close its section there.
(() => {
	const STORAGE_KEY = "alice-tree-nav-state";
	const TRANSITION_KEY = "alice-tree-nav-transition";
	const TOGGLE_SELECTOR = ".tree-nav-toggle-input";
	const TITLE_SELECTOR = ".tree-nav-section-link";
	const EASING = "ease-in-out";

	const navs = document.querySelectorAll("nav.tree-nav");
	const toggles = document.querySelectorAll(TOGGLE_SELECTOR);
	if (!navs.length || !toggles.length) return;
	const autoCollapse = navs[0].dataset.treeNavAutoCollapse !== "false";
	const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

	const readState = () => {
		try {
			return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
		} catch (error) {
			/* sessionStorage can be unavailable (private mode); state is optional. */
			return {};
		}
	};

	const writeState = (state) => {
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch (error) {
			/* Ignore write failures for the same reason. */
		}
	};

	// Save the effective state of every toggle, including branches opened
	// because they are on the current path and siblings closed automatically.
	const persist = () => {
		const saved = readState();
		toggles.forEach((input) => {
			saved[input.id] = input.checked;
		});
		writeState(saved);
	};

	const boxFor = (input) => input.closest("li")?.querySelector(":scope > .tree-nav-children");

	const siblingToggles = (input) => {
		const item = input.closest("li");
		const list = item?.parentElement;
		if (!list) return [];
		return [...list.children]
			.filter((sibling) => sibling !== item)
			.map((sibling) => sibling.querySelector(":scope > .tree-nav-toggle-input"))
			.filter(Boolean);
	};

	const normalizePath = (path) => path.replace(/\/+$/, "") || "/";

	const cancelAnimation = (box) => {
		if (box?._treeNavCleanup) {
			box._treeNavCleanup();
			box._treeNavCleanup = null;
		}
	};

	const applyBoxState = (box, expanded) => {
		box.style.willChange = "";
		box.style.transition = "none";
		if (expanded) {
			box.style.display = "block";
			box.style.height = "auto";
			box.style.overflow = "visible";
		} else {
			box.style.display = "none";
			box.style.height = "0px";
			box.style.overflow = "hidden";
		}
	};

	const setBoxState = (box, expanded) => {
		if (!box) return;
		cancelAnimation(box);
		applyBoxState(box, expanded);
	};

	// Docusaurus's dynamic duration: larger sections take longer to open/close.
	const durationFor = (height) => {
		if (reduceMotion) return 0;
		const constant = height / 36;
		return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
	};

	const animateBox = (box, expanded) => {
		if (!box) return;
		cancelAnimation(box);
		if (reduceMotion) {
			applyBoxState(box, expanded);
			return;
		}

		// Start from the current rendered height so interrupting an animation
		// stays smooth instead of jumping to the target.
		const current = box.getBoundingClientRect().height;
		box.style.transition = "none";
		box.style.display = "block";
		box.style.overflow = "hidden";
		box.style.height = `${current}px`;
		void box.offsetHeight;

		let target = 0;
		if (expanded) {
			box.style.height = "0px";
			void box.offsetHeight;
			target = box.scrollHeight;
		}

		if (current === target) {
			applyBoxState(box, expanded);
			return;
		}

		const duration = durationFor(expanded ? target : box.scrollHeight);
		box.style.willChange = "height";
		box.style.transition = `height ${duration}ms ${EASING}`;
		box.style.height = `${target}px`;

		const cleanup = () => {
			box.removeEventListener("transitionend", onEnd);
			clearTimeout(timer);
			box._treeNavCleanup = null;
		};
		const finish = () => {
			if (!box._treeNavCleanup) return;
			cleanup();
			applyBoxState(box, expanded);
		};
		const onEnd = (event) => {
			if (event.target === box && event.propertyName === "height") finish();
		};
		const timer = setTimeout(finish, duration + 50);
		box._treeNavCleanup = cleanup;
		box.addEventListener("transitionend", onEnd);
	};

	const collapseSiblings = (input, animate) => {
		if (!autoCollapse) return;
		siblingToggles(input).forEach((sibling) => {
			if (!sibling.checked) return;
			sibling.checked = false;
			const box = boxFor(sibling);
			if (animate) animateBox(box, false);
			else setBoxState(box, false);
		});
	};

	// Was this load reached by following a sidebar link? Start from the state
	// saved on the previous page, then animate to this page's state.
	let transition = false;
	try {
		const target = sessionStorage.getItem(TRANSITION_KEY);
		if (target) {
			sessionStorage.removeItem(TRANSITION_KEY);
			transition = normalizePath(target) === normalizePath(location.pathname);
		}
	} catch (error) {
		/* The transition is optional; the final state still applies. */
	}

	const saved = readState();
	document.documentElement.classList.add("tree-nav-restoring");

	// The settled state of this page: remembered branches plus the active path.
	const nextStates = new Map();
	toggles.forEach((input) => {
		const value = Object.prototype.hasOwnProperty.call(saved, input.id) ? saved[input.id] === true : input.checked;
		nextStates.set(input, value);
	});
	// Collapse defaults apply to nodes outside the active path; the current
	// section and its ancestors are not flagged and always open.
	toggles.forEach((input) => {
		if (input.hasAttribute("data-tree-nav-default-expanded")) {
			nextStates.set(input, true);
		} else if (input.hasAttribute("data-tree-nav-default-collapsed")) {
			nextStates.set(input, false);
		} else if (input.hasAttribute("data-tree-nav-active")) {
			nextStates.set(input, true);
		}
	});
	// Expanding an active category closes its siblings, like Docusaurus.
	if (autoCollapse) {
		toggles.forEach((input) => {
			if (!nextStates.get(input) || !input.hasAttribute("data-tree-nav-active")) return;
			siblingToggles(input).forEach((sibling) => nextStates.set(sibling, false));
		});
	}

	if (transition) {
		// Show the previous page's tree first, then animate the differences.
		toggles.forEach((input) => {
			if (Object.prototype.hasOwnProperty.call(saved, input.id)) {
				input.checked = saved[input.id] === true;
			}
		});
		toggles.forEach((input) => setBoxState(boxFor(input), input.checked));

		requestAnimationFrame(() => {
			document.documentElement.classList.remove("tree-nav-restoring");
			toggles.forEach((input) => {
				const next = nextStates.get(input);
				if (input.checked === next) return;
				input.checked = next;
				animateBox(boxFor(input), next);
			});
			persist();
		});
	} else {
		toggles.forEach((input) => {
			input.checked = nextStates.get(input);
			setBoxState(boxFor(input), input.checked);
		});
		persist();
		requestAnimationFrame(() => {
			document.documentElement.classList.remove("tree-nav-restoring");
		});
	}

	navs.forEach((nav) => {
		nav.addEventListener("click", (event) => {
			if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
				return;
			}
			const link = event.target.closest("a[href]");
			if (!link || !nav.contains(link)) return;
			const samePage = normalizePath(link.pathname) === normalizePath(location.pathname);
			if (samePage) {
				// The current section page's title toggles instead of navigating.
				if (!link.matches(TITLE_SELECTOR)) return;
				const input = link.closest("li")?.querySelector(":scope > .tree-nav-toggle-input");
				if (!input) return;
				event.preventDefault();
				input.click();
				return;
			}
			try {
				sessionStorage.setItem(TRANSITION_KEY, link.pathname);
			} catch (error) {
				/* The navigation still works without the sidebar transition. */
			}
		});

		nav.addEventListener("change", (event) => {
			const input = event.target.closest(TOGGLE_SELECTOR);
			if (!input) return;
			if (input.checked) {
				collapseSiblings(input, true);
				animateBox(boxFor(input), true);
			} else {
				animateBox(boxFor(input), false);
			}
			persist();
		});
	});
})();
