<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="标题">
                <el-input v-model="form.title" :disabled="true"/>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="form.author" :disabled="true"/>
            </el-form-item>
            <el-form-item label="类型">
                <el-radio-group v-model="form.type" @change="changetype" disabled >
                    <el-radio label="图文" />
                    <el-radio label="视频" />
                    <el-radio label="组图" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="类型" >
                <el-radio-group v-model="form.status" disabled >
                    <el-radio label="隐藏" />
                    <el-radio label="正常" />
                    <el-radio label="推荐" />
                </el-radio-group>
            </el-form-item>

            <el-input v-if="filestatus" v-model="form.images" />
            <el-input v-if="filestatus" v-model="form.video" />
            <!-- <el-input v-if="filestatus" v-model="form.thumb_images" /> -->

            <el-form-item label="缩略图">
                <el-upload action="http://fastadmin.cc/api/Upload/index" list-type="picture-card" name="file"
                    :auto-upload="true" 
                    :on-success="imgSuccess" 
                    :on-change="imgSuccessStatus" 
                    :file-list="fileList"
                    :class="{hide_box}"
                   
                    >
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                        <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                <i class="el-icon-zoom-in"></i>
                            </span>
                            <!-- <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                                <i class="el-icon-download"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                <i class="el-icon-delete"></i>
                            </span> -->
                        </span>
                    </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

            <el-form-item label="视频" v-show="video_status">
                <el-upload action="http://fastadmin.cc/api/Upload/index" list-type="picture-card" :auto-upload="true"
                    :on-success="videoSuccess" :file-list="videolist"  
                    :class="{hide_box}"  
                    >
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                    </div>
                </el-upload>
            </el-form-item>

            <el-form-item label="组图" v-show="thumb_images_status">
                <el-upload action="http://fastadmin.cc/api/Upload/index" list-type="picture-card" :auto-upload="true"
                    :on-success="thumb_imagesSuccess" :file-list="thumbimageslist"  :class="{hide_box}">
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                        <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                <i class="el-icon-zoom-in"></i>
                            </span>
                            <!-- <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                                <i class="el-icon-download"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                <i class="el-icon-delete"></i>
                            </span> -->
                        </span>
                    </div>
                </el-upload>
            </el-form-item>



            <el-form-item label="文章内容" v-show="content_status">
                <el-card style="height: 400px;">
                    <!-- <quill-editor v-model="form.content" ref="myQuillEditor" style="height: 500px;" :options="editorOption"> -->
                    <quill-editor v-model="form.content" ref="myQuillEditor" style="height: 500px;">
                    </quill-editor>
                </el-card>

            </el-form-item>


            <el-form-item>
              
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>
  
<script>

import { addarticle } from '@/api/article'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
    components: {
        quillEditor
    },
    name: "dialogPage",
    props: ['rowdata'],
    data() {
        return {
            form: {
                title: '',
                author: '',
                images: '',
                status: '',
                id: '',
                type: '',
                content: '',
                video: '',
                thumb_images: '',
            },
            content_status: false,
            video_status: false,
            thumb_images_status: false,
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            filestatus: false,
            fileList: [{ url: '' }],
            videolist: [{ url: '' }],
            thumbimageslist: [],
            thumbimageslistnew: '',
            hide_box:true
        }
    },
    created() {

        if (this.rowdata) {


            this.form = this.rowdata

            if (this.rowdata.images != undefined) {
                this.fileList[0].url = this.rowdata.images
            } else {
                this.fileList = [];
            }

            if (this.rowdata.video != undefined) {
                this.videolist[0].url = this.rowdata.video
            } else {
                this.videolist = [];
            }

            if (this.rowdata.thumb_images != undefined) {
                this.thumb_images_status = true
                // this.thumbimageslist= this.rowdata.thumb_images

                var thumb = [];

                for (var ii = 0; ii < this.rowdata.thumb_images.length; ii++) {

                    thumb.push({ "url": this.rowdata.thumb_images[ii] });
                }

                this.thumbimageslist = thumb;
                //重新赋值
                this.thumbimageslistnew = this.rowdata.thumb_images_yuanshi;


            } else {
                this.thumbimageslist = [];
            }
        }
    },
    methods: {
        onSubmit() {
            let title = this.form.title
            let images = this.form.images
            let status = this.form.status
            let id = this.form.id
            this.form.thumb_images = this.thumbimageslistnew
           
            addarticle(this.form).then(response => {
                location.reload();
            })
        },
        onCancel() {
            this.$message({
                message: 'cancel!',
                type: 'warning'
            })
        },
        imgSuccess(response, file, fileList) {

            this.form.images = response.filename;

            this.fileList = [fileList[fileList.length - 1]];
        },
        imgSuccessStatus(file, fileList) {

        },
        handleRemove(file) {
            console.log(file);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleDownload(file) {
            console.log(file);
        },
        changetype(val) {

            if (val == '视频') {
                this.content_status = false;
                this.thumb_images_status = false;
                this.video_status = true
            } else if (val == '图文') {

                this.content_status = true;
                this.video_status = false;
                this.thumb_images_status = false
            } else {
                //组图
                this.content_status = false;
                this.video_status = false;
                this.thumb_images_status = true

            }

        },
        videoSuccess(response, file, videolist) {

            this.form.video = response.filename;

            this.videolist = [videolist[videolist.length - 1]];
        },
        //组图
        thumb_imagesSuccess(response, file, thumbimageslist) {
            
            this.thumbimageslistnew += response.filename+'---'

        }

    }

}
</script>
  
<style scoped>
.line {
    text-align: center;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.hide_box /deep/ .el-upload--picture-card {
    display: none;
}
</style>
  
  