import {createUploadthing} from "uploadthing/server";

const f = createUploadthing()

export const uploadRouter = {
    imageUploader: f({
        image: {
            maxFileSize: '4MB',
            maxFileCount: 2
        }
    }).onUploadComplete((data) => {
        console.log("Upload completed", data)
        alert("Upload completed")
    })
}