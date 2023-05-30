const { Server } = require("socket.io");

const io = new Server(3001, {
    cors: {
      origins: ["http://localhost:3000", "https://chatify-app.vercel.app"]
    },
  });
  
  let activeUsers = [];

io.on("connection", (socket) => {
 
  socket.on("add-user", (newUserId) => {
    
    if (!activeUsers.some(user=> user.userId === newUserId)) {
      
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });

  console.log("ActiveUsers:",activeUsers)

  socket.on("send-message", (data) => {
    const { receiverId } = data;

    const user = activeUsers.find(({userId}) => userId === receiverId);
    
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    console.log("User:",user)
  
    if (user) {
       
      io.to(user.socketId).emit("receive-message", data);
      
    }
  });
});