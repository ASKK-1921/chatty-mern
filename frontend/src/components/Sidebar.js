import React, { useContext, useEffect } from "react";
import { ListGroup, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";

function Sidebar() {
  // const rooms = ["first room", "second room", "third room"];
  const user = useSelector((state) => state.user);
  const {
    socket,
    rooms,
    setRooms,
    currentRoom,
    setCurrentRoom,
    members,
    setMembers,
    privateMemberMessage,
    setPrivateMemberMessage,
  } = useContext(AppContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      fetch("http://localhost:5001/rooms")
        .then((res) => res.json())
        .then((data) => setRooms(data));
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, [setCurrentRoom, setRooms, socket, user]);

  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  if (!user) {
    return <div></div>;
  }

  function joinRoom(room, isPublic = true) {
    if (!user) {
      return alert("Please log in");
    }
    socket.emit("join-room", room);
    setCurrentRoom(room);
    if (isPublic) {
      setPrivateMemberMessage(null);
    }
    // dispatch for notifications
    dispatch(resetNotifications(room));
  }

  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom !== room) {
      dispatch(addNotifications(room));
    }
  });

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  }

  function handlePrivateMemberMessage(member) {
    setPrivateMemberMessage(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

  return (
    <div>
      <h2>Available Rooms</h2>
      <ListGroup>
        {rooms.map((room, idx) => (
          <ListGroup.Item
            key={idx}
            onClick={() => joinRoom(room)}
            active={room === currentRoom}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {room}{" "}
            {currentRoom !== room && (
              <span className="badge rounded-pill bg-primary">
                {user.newMessages[room]}
              </span>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
      {members.map((member) => (
        <ListGroup.Item
          key={member.id}
          style={{ cursor: "pointer" }}
          active={privateMemberMessage?._id === member._id}
          onClick={() => handlePrivateMemberMessage(member)}
          disabled={member._id === user._id}
        >
          <Row>
            <Col xs={2} className="member-status">
              <img
                src={member.picture}
                className="member-status-img"
                alt="Profile"
              />
              {member.status === "online" ? (
                <i className="fas fa-circle sidebar-online-status"></i>
              ) : (
                <i className="fas fa-circle sidebar-offline-status"></i>
              )}
            </Col>
            <Col xs={9}>
              {member.name}
              {member._id === user?._id && " (You)"}
              {member.status === "offline" && " (Offline)"}
            </Col>
            <Col xs={1}>
              <span className="badge rounded-pill bg-primary">
                {user.newMessages[orderIds(member._id, user._id)]}
              </span>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
    </div>
  );
}

export default Sidebar;
