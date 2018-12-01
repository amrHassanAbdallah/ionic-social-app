import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from '../../providers/user/user';
import {RequestsProvider} from '../../providers/requests/requests';
import {connreq} from '../../models/interfaces/request';
import firebase from 'firebase';
import {FollowProvider} from "../../providers/follow/follow";

/**
 * Generated class for the BuddiesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {
  newrequest = {} as connreq;
  temparr = [];
  filteredusers = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userservice: UserProvider, public alertCtrl: AlertController,
              public requestservice: RequestsProvider, public followService: FollowProvider) {
    this.userservice.getallusers().then((res: any) => {
      this.filteredusers = res;
      this.temparr = res;
    })
  }

  ionViewDidLoad() {

  }

  searchuser(searchbar) {
    this.filteredusers = this.temparr;
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return;
    }

    this.filteredusers = this.filteredusers.filter((v) => {
      if (v.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }

  sendreq(recipient) {
    this.newrequest.sender = firebase.auth().currentUser.uid;
    this.newrequest.recipient = recipient.uid;

      let successalert = this.alertCtrl.create({
        title: 'Request sent',
        subTitle: 'Your request was sent to ' + recipient.displayName,
        buttons: ['ok']
      });

      this.requestservice.sendrequest(this.newrequest).then((res: any) => {
        if (res.success) {
          successalert.present();
          let sentuser = this.filteredusers.indexOf(recipient);
          this.filteredusers.splice(sentuser, 1);
        }
      }).catch((err) => {
        alert(err);
      })
  }

  follow(userToFollow) {
    let successalert = this.alertCtrl.create({
      title: 'Request sent',
      subTitle: 'You followed ' + userToFollow.displayName || userToFollow.username,
      buttons: ['ok']
    });


    this.followService.follow(userToFollow.uid).then((res: any) => {
      if (res.success) {
        successalert.present();
        this.navCtrl.pop();
        this.navCtrl.push(BuddiesPage)
      }
    }).catch((err) => {
      alert(err);
    })
  }

  unfollow(userToFollow) {
    let successalert = this.alertCtrl.create({
      title: 'Request sent',
      subTitle: 'You un followed ' + userToFollow.displayName || userToFollow.username,
      buttons: ['ok']
    });


    this.followService.unfollow(userToFollow.uid).then((res: any) => {
      if (res.success) {
        successalert.present();
        this.navCtrl.pop();
        this.navCtrl.push(BuddiesPage)


      }
    }).catch((err) => {
      alert(err);
    })
  }

  is_followed(key) {
    key = this.get_follow_key(key);
    return key != null;
  }

  get_follow_key(key) {
    for (var i in key.followers) {
      if (key.followers[i].user_id === firebase.auth().currentUser.uid) {
        return i;
      }
    }
    return null;
  }

}
