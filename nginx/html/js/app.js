document.addEventListener('DOMContentLoaded', function() {
    // Load messages when page loads
    fetchMessages();
    
    // Add event listener for the form submission
    document.getElementById('submit-btn').addEventListener('click', function() {
        submitMessage();
    });
});

function fetchMessages() {
    fetch('/api/messages')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(messages => {
            displayMessages(messages);
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
            document.getElementById('messages-container').innerHTML = 
                '<div class="message error">Error loading messages. Please try again later.</div>';
        });
}

function displayMessages(messages) {
    const container = document.getElementById('messages-container');
    
    if (messages.length === 0) {
        container.innerHTML = '<div class="message">No messages yet. Be the first to post!</div>';
        return;
    }
    
    container.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <h3>${escapeHtml(message.title)}</h3>
            <p>${escapeHtml(message.content)}</p>
        `;
        container.appendChild(messageElement);
    });
}

function submitMessage() {
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content');
        return;
    }
    
    fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Clear form
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        
        // Reload messages
        fetchMessages();
    })
    .catch(error => {
        console.error('Error adding message:', error);
        alert('Error adding message. Please try again.');
    });
}

// Helper function to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
