const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

const emailTOSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
io.on("connection", (socket) => {
  socket.on("room:join", (data) => {
    const { email, room } = data; //data extract
    emailTOSocketIdMap.set(email, socket.id); // data mapping
    socketIdToEmailMap.set(socket.id, email); // data mapping

    io.to(room).emit("user:join", { email, id: socket.id });

    socket.join(room);

    io.to(socket.id).emit("room:join", data); // data receiver ko bhej diya , for joining
  });

  socket.on("user:call", ({to, offer}) => {
    console.log(offer);
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });


  socket.on('call:accepted' , ({to , ans})=>{
 
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  })

  socket.on('peer:nego:needed' , ({to , offer})=>{
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  })

  socket.on('peer:nego:done' ,({to ,ans})=>{
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });

  })
});
