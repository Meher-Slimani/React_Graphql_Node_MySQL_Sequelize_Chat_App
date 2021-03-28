import { Col, Image } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";

import { useMessageDispatch, useMessageState } from "../../context/message";

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

const Users = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((user) => user.selected === true);
  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }),
    onError: (err) => console.log(err),
  });

  let usersMarkup;
  if (!users || loading) {
    usersMarkup = <p>Loading..</p>;
  } else if (users.length === 0) {
    <p>No users have joined yet</p>;
  } else if (users.length > 0) {
    usersMarkup = users.map((user) => {
      const selected = selectedUser?.username === user.username;
      return (
        <div
          role="button"
          className={classNames(
            "p-3 user-div d-flex justify-content-center justify-content-md-start",
            {
              "bg-white": selected,
            }
          )}
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
        >
          <Image
            src={
              user.imageUrl ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            className="user-image"
          />
          <div className="ml-2 d-none d-md-block">
            <p className="text-success">{user.username}</p>
            <p className="font-wheight-light"></p>
            {user.latestMessage
              ? user.latestMessage.content
              : "You are now connected!"}
          </div>
        </div>
      );
    });
  }
  return (
    <Col xs={2} md={4} className="p-0 bg-secondary">
      {usersMarkup}
    </Col>
  );
};

export default Users;
