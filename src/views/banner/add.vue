<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="title">
                <el-input v-model="form.title" />
            </el-form-item>

            <el-form-item label="Activity zone">
                <el-select v-model="form.status" placeholder="please select your zone">
                    <el-option label="隐藏" value="隐藏" />
                    <el-option label="正常" value="正常" />
                </el-select>
            </el-form-item>

            <el-input v-if="filestatus" v-model="form.images" />

            <el-form-item label="轮播图">
                <el-upload action="http://fastadmin.cc/api/Upload/index" list-type="picture-card" name="file"
                    :auto-upload="true" :on-success="imgSuccess" :on-change="imgSuccessStatus" :file-list="fileList">
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                        <!-- <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                <i class="el-icon-zoom-in"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                                <i class="el-icon-download"></i>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                <i class="el-icon-delete"></i>
                            </span>
                        </span> -->
                    </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">Create</el-button>
                <el-button @click="onCancel">Cancel</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>
  
<script>

import { addbanner } from '@/api/table'

export default {
    name: "dialogPage",
    props: ['rowdata'],
    data() {
        return {
            form: {
                title: '',
                images: '',
                status: '',
                id: '',
            },
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            filestatus: false,
            fileList:[{url:''}]
        }
    },
    created() {
        
       if(this.rowdata){
        this.form =this.rowdata
        if(this.rowdata.images!=undefined){
            this.fileList[0].url=this.rowdata.images
        }else{
            this.fileList = [];
        }
     
       }
  },
    methods: {
        onSubmit() {
            let title = this.form.title
            let images = this.form.images
            let status = this.form.status
            let id = this.form.id
            addbanner({ title, images, status ,id}).then(response => {
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

            this.fileList=[fileList[fileList.length-1]];


        },
        imgSuccessStatus(file, fileList){
          
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
</style>
  
  