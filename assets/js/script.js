document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent default form submission behavior

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Simulate form submission for now
    const result = document.getElementById('form-result');
    result.textContent = `Thank you, ${name}! Your message has been sent.`;
    result.style.color = 'green';

    // Clear form fields
    document.getElementById('contact-form').reset();
});

