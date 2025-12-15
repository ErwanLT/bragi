/**
 * Sets up F12 and DevTools protection.
 * @param {string} redirectUrl - The URL to redirect to when DevTools use is detected.
 */
window.setupF12Protection = function (redirectUrl) {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'F12' || event.keyCode === 123 ||
            (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key)) ||
            (event.metaKey && event.altKey && ['I', 'J', 'C'].includes(event.key))) {
            event.preventDefault();
            window.location.href = redirectUrl;
        }
    });

    // Disable right-click and redirect
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        window.location.href = redirectUrl;
    });
};
