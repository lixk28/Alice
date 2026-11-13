(() => {
	const closeAll = (except) => {
		document.querySelectorAll(".dropdown-checkbox:checked").forEach((cb) => {
			if (cb !== except) {
				cb.checked = false;
			}
		});
	};

	const clearDismissed = () => {
		document.querySelectorAll(".dropdown.is-dismissed").forEach((el) => {
			el.classList.remove("is-dismissed");
		});
	};

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeAll(null);
			clearDismissed();
		}
	});

	document.querySelectorAll('.dropdown[data-dropdown-mode="hover"]').forEach((root) => {
		root.addEventListener("mouseleave", () => {
			root.classList.remove("is-dismissed");
		});
	});

	document.addEventListener("click", (event) => {
		const hoverToggle = event.target.closest?.(
			'.dropdown[data-dropdown-mode="hover"] > .dropdown-toggle'
		);
		if (hoverToggle) {
			const root = hoverToggle.closest(".dropdown");
			event.preventDefault();
			root.classList.add("is-dismissed");
			const checkbox = root.querySelector(".dropdown-checkbox");
			if (checkbox) {
				checkbox.checked = false;
			}
			return;
		}

		const clickRoot = event.target.closest?.(
			'.dropdown[data-dropdown-mode="click"]'
		);
		if (!clickRoot) {
			closeAll(null);
			return;
		}

		const checkbox = clickRoot.querySelector(".dropdown-checkbox");
		closeAll(checkbox);
	});
})();
