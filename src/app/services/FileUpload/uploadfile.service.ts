import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
	providedIn: 'root'
})
export class UploadfileService {
	FOLDER = 'upload/Product/';
	bucket;

	constructor() {
		this.bucket = new S3({
			accessKeyId: 'AKIAJ24V6HQ7KHF6KAEA',
			secretAccessKey: '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',
			region: 'us-east-1'
		});
	}

	uploadfile(files, fileInfo, callback) {
		let date = new Date();
		let timestamp = date.getTime();
		var respArray = [];
		var totalCount = files.length;
		var counter = 0;
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			var fName = timestamp + '_' + file.name;
			var keyPath = this.FOLDER + fName;
			const params = {
				Bucket: 'wom-documents',
				Key: keyPath,
				Body: file
			};

			const options = {
				partSize: 5 * 1024 * 1024,
				queueSize: 1,
				// Give the owner of the bucket full control
				ACL: 'bucket-owner-full-control'
			};


			var resObj = {};
			this.bucket.upload(params, options, function (err, data) {
				if (err) {
					resObj['success'] = false;
					if(resObj['respArray']!==undefined && resObj['respArray'].length > 0){
						for(let i=0;i<resObj['respArray'].length;i++) {
							this.deleteFile([],{},resObj['respArray'][i].path,res=>{
								console.log('Data Deleting from s3 delete function');
							})
						}
					}
					resObj['respArray'] = [];
					callback(resObj);
				}else if (data) {
					var obj = {};
					let str = data['key'];
					let lstslashfinm = str.lastIndexOf("/");
					let filename = str.substring(lstslashfinm+1,str.length);
					let subfold = str.substring(0,lstslashfinm);
					let lstslashflnm = subfold.lastIndexOf("/");
					let foldername = str.substring(lstslashflnm+1,subfold.length);
					//console.log(filename,'======Filename++++','foldername======',foldername);
					obj['fileName'] = filename;
					obj['contentType'] = file.type;
					obj['path'] =  data['key'];
					respArray.push(obj);
					console.log('respArray after each file upload', respArray);
					counter++;
					if ((counter) === totalCount) {
						console.log('respArray after all files uploaded', respArray);
						resObj['success'] = true;
						resObj['respArray'] = respArray;
						let fileDataArr = Object.keys(fileInfo);
						if(fileInfo['finalCounter'] != undefined) {
							resObj['FnlCount'] = fileInfo['finalCounter'];
						}
						if (fileDataArr.length > 0) {
							resObj['resName'] = foldername;
							resObj['Counter'] = fileInfo.index;
						}
						callback(resObj);
					}
				}
			});
		}
	}
	deleteFile(files, extraParam, Path, callback) {
		const params = {
			Bucket: 'wom-documents',
			Key: Path
		};
		const resObj = {};
		this.bucket.deleteObject(params, function (err, data) {
			if (err) {
				console.log('There was an error deleting your file: ', err.message);
				resObj['success'] = false;
				resObj['respArray'] = [];
				callback(resObj);
			} else if (data) {
						if(Object.keys(extraParam).length > 0) { 
						if(extraParam['finalDeleteCounter'] != undefined) {
							resObj['finalDeleteCounter'] = extraParam['finalDeleteCounter'];
						}
						if(extraParam['name'] != undefined) {
							resObj['resName'] =  extraParam['name'];
						}
					}
				if(files.length > 0) {
					resObj['id'] = files.id;
				}
				resObj['success'] = true;
				console.log('Successfully deleted file.');
				callback(resObj);
			}
		});
	}
}
