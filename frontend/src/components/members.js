import React, { Component } from "react";
import Table from "react-bootstrap/Table";

class Members extends Component {
  state = {};
  render() {
    var users = this.props.users;
    var memberList = users.map(user => (
      <tr>
        <td style={{ paddingLeft: "20px", paddingTop: "11px", fontSize: "1.2rem" }}>{user.name}</td>
        <td style={{ paddingBottom: 0, paddingRight: 0, textAlign: "right" }}>
          <iframe
            src={
              "https://open.spotify.com/follow/1/?uri=" +
              user.uri +
              "&size=basic&theme=dark"
            }
            width="200"
            height="35"
            scrolling="no"
            frameborder="0"
            style={{ border: "none", overflow: "hidden" }}
            allowtransparency="true"
          ></iframe>
        </td>
      </tr>
    ));

    return (
      <div style={{ height: "45vh" }}>
        <h2>In the house:</h2>
        <Table
          striped
          hover
          variant="dark"
          style={{ overflowY: "auto" }}
        >
          <tbody>{memberList}</tbody>
        </Table>
      </div>
    );
  }
}

export default Members;
