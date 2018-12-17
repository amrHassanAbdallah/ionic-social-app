import {Injectable} from '@angular/core';
import {FileChooser} from '@ionic-native/file-chooser';
import firebase from 'firebase';

/*
  Generated class for the ImghandlerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ImghandlerProvider {
  nativepath: any;
  firestore = firebase.storage();

  constructor(public filechooser: FileChooser) {
  }

  uploadimage(image_name = firebase.auth().currentUser.uid, location = '/profileimages') {
    return new Promise((resolve, reject) => {
      this.filechooser.open().then((url) => {
        (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
            res.file((resFile) => {
              var reader = new FileReader();
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) => {
                var imgBlob = new Blob([evt.target.result], {type: 'image/jpeg'});
                var imageStore = this.firestore.ref(location).child(image_name);
                imageStore.put(imgBlob).then(async (res) => {
                  if (location == '/profileimages') {
                    resolve(await this.getAuserImage(firebase.auth().currentUser.uid));

                  } else {
                    resolve(await this.getImage(image_name, '/posts_img'))
                  }
                }).catch((err) => {
                  reject(err);
                })
              }
            })
          })
        })
      })
    });
  }

  getAuserImage(userId) {
    return new Promise((resolve2, reject2) => {
      this.firestore.ref('/profileimages').child(userId).getDownloadURL().then((url) => {
        resolve2(url);
      }).catch((err) => {
        reject2(err);
      })
    })

  }


  getImage(model_id, location) {
    return new Promise((resolve2, reject2) => {
      this.firestore.ref(location).child(model_id).getDownloadURL().then((url) => {
        resolve2(url);
      }).catch((err) => {
        reject2(err);
      })
    })

  }
}
