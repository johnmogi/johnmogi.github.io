// Toast Notification System
function showNotification(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || (() => {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
        return container;
    })();

    const toast = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' :
                   type === 'success' ? 'bg-green-500' : 'bg-blue-500';

    toast.className = `${bgColor} text-white px-4 py-2 rounded shadow-lg transform translate-x-full transition-transform duration-300`;
    toast.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">×</button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Alias for showToast to maintain compatibility
function showToast(message, type = 'info') {
    showNotification(message, type);
}
