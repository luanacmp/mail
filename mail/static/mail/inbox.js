document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Submit handle for composing email
  document.querySelector("#compose-form").addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function view_email(id) {
  // Fetch the email details
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      // Mark the email as read if it is not already
      if (!email.read) {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ read: true })
        });
      }

      // Show email details
      document.querySelector('#emails-view').innerHTML = `
        <ul class="list-group">
          <li class="list-group-item"><strong>From:</strong> ${email.sender}</li>
          <li class="list-group-item"><strong>To:</strong> ${email.recipients.join(', ')}</li>
          <li class="list-group-item"><strong>Subject:</strong> ${email.subject}</li>
          <li class="list-group-item"><strong>Timestamp:</strong> ${email.timestamp}</li>
          <hr>
          <li class="list-group-item">${email.body}</li>
          <div class="d-flex justify-content-end align-items-center mt-5">
            <button id="reply-btn" class="btn btn-primary mr-3">Reply</button>
            <button id="archive-btn" class="${email.archived ? 'hidden' : ''} btn btn-success">Archive</button>
            <button id="unarchive-btn" class="${email.archived ? '' : 'hidden'} btn btn-danger">Unarchive</button>
          </div>
        </ul>
      `;

      // Event listener for reply button
      document.querySelector('#reply-btn').addEventListener('click', () => {
        compose_email(); // Show compose view

        // Pre-fill the composition form
        document.querySelector('#compose-recipients').value = email.sender;
        const originalSubject = email.subject.startsWith('Re: ') ? email.subject : `Re: ${email.subject}`;
        document.querySelector('#compose-subject').value = originalSubject;
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:\n\n${email.body}`;
      });

      // Event listener for archive button
      document.querySelector('#archive-btn').addEventListener('click', () => {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ archived: true })
        })
        .then(() => load_mailbox('inbox'))
        .catch(error => console.error('Error archiving email:', error));
      });

      // Event listener for unarchive button
      document.querySelector('#unarchive-btn').addEventListener('click', () => {
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ archived: false })
        })
        .then(() => load_mailbox('archive'))
        .catch(error => console.error('Error unarchiving email:', error));
      });

      // Show the email view and hide other views
      document.querySelector('#emails-view').style.display = 'block';
      document.querySelector('#compose-view').style.display = 'none';
    })
    .catch(error => console.error('Error fetching email details:', error));
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 class="text-white">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch the emails for this mailbox
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Clear previous emails
      document.querySelector('#emails-view').innerHTML = `<h3 class="text-white">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

      // Loop through emails and create a div for each
      emails.forEach(singleEmail => {
        const newEmail = document.createElement('div');
        newEmail.className = `list-group-item ${singleEmail.read ? 'read' : 'unread'} ${singleEmail.archived ? 'archived' : ''}`;
        newEmail.innerHTML = `
          <h6>Sender: ${singleEmail.sender}</h6>
          <h5>Subject: ${singleEmail.subject}</h5>
          <p>${singleEmail.timestamp}</p>
        `;
        newEmail.addEventListener('click', () => view_email(singleEmail.id));
        document.querySelector('#emails-view').append(newEmail);
      });
    })
    .catch(error => console.error('Error fetching emails:', error));
}

function send_email(event) {
  event.preventDefault();
  
  // Store fields
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Send data to the backend
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    load_mailbox('sent');
  })
  .catch(error => console.error('Error sending email:', error));
}
