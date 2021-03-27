import { Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useQuery, useLazyQuery } from "@apollo/client";

import { useAuthDispatch } from "../context/auth";
import { useEffect, useState } from "react";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        content
        from
        to
        createdAt
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      content
      from
      to
      createdAt
    }
  }
`;

const Home = ({ history }) => {
  const dispatch = useAuthDispatch();
  const [selectedUser, setSelectedUser] = useState(null);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  const { loading, data, error } = useQuery(GET_USERS);

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

  if (messagesData) console.log(messagesData.getMessages);

  let usersMarkup;
  if (!data || loading) {
    usersMarkup = <p>Loading..</p>;
  } else if (data.getUsers.length === 0) {
    <p>No users have joined yet</p>;
  } else if (data.getUsers.length > 0) {
    usersMarkup = data.getUsers.map((user) => (
      <div
        className="p-3 d-flex"
        key={user.username}
        onClick={() => setSelectedUser(user.username)}
      >
        <Image
          src={user.imageUrl}
          roundedCircle
          className="mr-2"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
        <div>
          <p className="text-success">{user.username}</p>
          <p className="font-wheight-light"></p>
          {user.latestMessage
            ? user.latestMessage.content
            : "You are now connected!"}
        </div>
      </div>
    ));
  }

  return (
    <>
      <Row className="mb-1 bg-white justify-content-around">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row className="bg-white">
        <Col xs={4} className="p-0 bg-secondary">
          {usersMarkup}
        </Col>
        <Col xs={8}>
          {messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map((message) => (
              <p key={message.uuid}>{message.content}</p>
            ))
          ) : (
            <p>Messages</p>
          )}
        </Col>
      </Row>
    </>
  );
};

export default Home;
