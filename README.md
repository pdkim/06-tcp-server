[![Build Status](https://travis-ci.com/pdkim/06-tcp-server.svg?branch=pk06)](https://travis-ci.com/pdkim/06-tcp-server)

## Lab 06 TCP Server
Description: Create a chatroom server through the use of telnet.  Have users message each other and implement special commands they can enter.  Server should be able to log data and send error messages if unable to do a task.

## Requirements
- The chatroom module should connect user(s) to telnet
- User should have special commands in chatroom
- No testing required(?)
- No third party APIs(?)

##Tests
1. Checks if user is created?
Yes, they should be.
2. Checks if user can send messages to server?
Yes, both to everyone and directly.
3. Check user commands such as quit and list are functional?
List is working.
Quit notifies the chat someone will leave once I figure out how to get one user to exit out.
4. Check server is working?
Yes
5.  Any server side logging/error checking?
Not yet.