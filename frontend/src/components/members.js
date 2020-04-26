import React, { Component } from "react";
import Table from "react-bootstrap/Table";

class Members extends Component {
  state = {};
  render() {
    var users = this.props.users;
    var memberList = users.map(user => (
      <tr key={user}>
        <td style={{ paddingLeft: "20px", paddingTop: "11px", fontSize: "1.2rem", maxWidth: "50px"}}>{user.name}</td>
        <td style={{ paddingBottom: 0, paddingRight: 0, textAlign: "right",  maxWidth: "50px" }}>
          <iframe
            src={
              "https://open.spotify.com/follow/1/?uri=" +
              user.uri +
              "&size=basic&theme=dark"
            }
            width="200"
            height="35"
            scrolling="no"
            frameBorder="0"
            style={{ border: "none", overflow: "hidden" }}
            allowtransparency="true"
          ></iframe>
        </td>
      </tr>
    ));

    return (
      <div style={{width:"100%" }}>
        <h3>In the house:</h3>
        <Table
          striped
          hover
          variant="dark"
          style={{ overflow: "scroll" }}
        >
          <tbody>{memberList}</tbody>
        </Table>
      </div>
    );
  }
}

export default Members;
