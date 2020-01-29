import React, { Component } from "react";
import Table from "react-bootstrap/Table";

class Members extends Component {
  state = {};
  render() {
    var users = this.props.users;
    var memberList = users.map(user => (
      <tr style={{ height: "30px" }}>
        <td style={{ paddingLeft: "20px" }}>{user.name}</td>
        <td style={{ paddingBottom: 0, paddingRight: 0, textAlign: "right" }}>
          <iframe
            src="https://open.spotify.com/follow/1/?uri=spotify:artist:6sFIWsNpZYqfjUpaCgueju&size=basic&theme=dark"
            width="200"
            height="25"
            scrolling="no"
            frameborder="0"
            style={{ border: "none", overflow: "hidden" }}
            allowtransparency="true"
          ></iframe>
        </td>
      </tr>
    ));

    return (
      <div style={{ height: "60%" }}>
        <h2>In the house:</h2>
        <Table
          striped
          hover
          variant="dark"
          style={{ overflowY: "auto", height: "100px" }}
        >
          <tbody>{memberList}</tbody>
        </Table>
      </div>
    );
  }
}

export default Members;
