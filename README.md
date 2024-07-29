# CS50-Project 3 - Mail 


- In this project i have to design a front-end for an email client that makes API calls to send and receive emails.

## Project Summary:
- Youtube short Video
In a brief video: [https://youtu.be/h6E4AQnpLnE](https://youtu.be/yb9nEL2wU1U)](https://youtu.be/h6E4AQnpLnE)
I'll show you all the specifications about it. 

**This project fulfills the following requirements:*

**Send Mail:**
When a user submits the email composition form, add JavaScript code to actually send the email.

**Mailbox:**
If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.
When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.

**View Email:**
When a user clicks on an email, the user should be taken to a view where they see the content of that email.
Once the email has been clicked on, you should mark the email as read.

**Archive and Unarchive:**
Allow users to archive and unarchive emails that they have received.
When viewing an Inbox email, the user should be presented with a button that lets them archive the email.
 When viewing an Archive email, the user should be presented with a button that lets them unarchive the email.
Once an email has been archived or unarchived, load the user’s inbox.

**Reply:**
When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.
When the user clicks the “Reply” button, they should be taken to the email composition form.
Pre-fill the composition form with the recipient field set to whoever sent the original email.
Pre-fill the subject line. If the original email had a subject line of foo, the new subject line should be Re: foo. (If the subject line already begins with Re: , no need to add it again.)

## Technologies:
**Back-end:**
- SQLite
- Python

**Front-end:**
- HTML (with Django templating)
- CSS (with some Bootstrap Components)
- Javascrip
