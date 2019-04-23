import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { UserSession, AppConfig } from 'blockstack';
declare let blockstack: any;
import { configure, User, getConfig, Model, UserGroup, GroupInvitation } from 'radiks-shim';
 // @ts-ignore
import Message from '../models/Message';
import { PrivateMessage } from '../models/PrivateGroupMessage';
// declare let radiks: any;
declare let window: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  title = 'app';
  userSession;
  userData;
  userGroupId = '6d4dc7926dd1-44b2-b429-0045d9e0960f'; // PrivateGroupMessages
  inviteId = '59af1e02e56a-43c2-9c25-6f512b5a4814'; // nicktee.id.blockstack inviteId

  constructor() {
    this.userSession = new blockstack.UserSession({
      appConfig: new blockstack.AppConfig(['store_write', 'publish_data'])
    });
    configure({
       apiServer: 'https://blockusign-radiks.azurewebsites.net',
       userSession: this.userSession
    });
  }

  ngAfterViewInit() {
    this.checkLoginStatus();
  }

  async checkLoginStatus() {
    if (this.userSession.isUserSignedIn()) {


      const { userSession } = getConfig();
      if (userSession.isSignInPending()) {
        await userSession.handlePendingSignIn();
        await User.createWithCurrentUser();
      }

      this.userData = this.userSession.loadUserData();

      // 1) User 1 Create Group and invite a user
      // await this.createPrivateGroup();
      // await this.inviteUser();

      // 2) User 2 Gets his groups and actives and invitation (invite id can be emailed)
      // await this.getMyGroups();
      // await this.activateGroup();

      // 3) Each user can add messages to the group
      // await this.addPrivateMessage();
      await this.getPrivateGroupMessages();


    } else if (this.userSession.isSignInPending()) {
      this.userSession.handlePendingSignIn().then(async (userData) => {
        setTimeout(async () => {
          const { userSession } = getConfig();
          if (userSession.isSignInPending()) {
            await userSession.handlePendingSignIn();
            await User.createWithCurrentUser();
          }
        }, 500 );
      });
    } else {
      this.userData = 'logging in...';
      this.userSession.redirectToSignIn('');
    }
  }

  async fetchMyRadiksData() {
    let m: any = Message;
    // const msg = await m.findById('4a2e41f6a3d6-43c8-a8c9-6500a76237cb');
    const messages = await m.fetchList(null, {decrypt: false});
    console.log(messages);
  }

  async createMessage() {
    let m: any = Message;
    let msg = new m({
       content: 'test ' + Date.now(),
       createdBy: 'nicktee.id',
     });
    const resp = await msg.save();
  }


  async createPrivateGroup() {
    let m: any = UserGroup;
    const group = new m({ name: 'PrivateGroupMessages' });
    await group.create();
  }


  async addPrivateMessage() {
    let m: any = PrivateMessage;
    let msg = new m({
       content: 'private group  | ' + this.userGroupId + ' | ' + Date.now(),
       createdBy: blockstack.loadUserData().username,
       userGroupId: this.userGroupId
     });
    const resp = await msg.save();
  }

  async getPrivateGroupMessages() {
    let m: any = PrivateMessage;
    // const msg = await m.findById('4a2e41f6a3d6-43c8-a8c9-6500a76237cb');
    const messages = await m.fetchList({
      userGroupId: this.userGroupId
    }, {decrypt: true});
    console.log('getPrivMsg', messages);
  }


  async getMyGroups() {
    const groups = await UserGroup.myGroups();
    console.log('myGroups', groups);
  }

  async inviteUser() {

    // TODO check that they have already signed into Radiks

    let g: any = UserGroup;
    const group: any = await g.findById(this.userGroupId);
    const usernameToInvite = 'nicktee.id.blockstack';
    const invitation = await group.makeGroupMembership(usernameToInvite);
    // console.log(invitation._id); // the ID used to later activate an invitation
  }

  async activateGroup() {
    await this.getMyGroups();
    const invitation = await GroupInvitation.findById(this.inviteId);
    await invitation.activate();
  }

}


