import { useCallback } from "react";
import react from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "../../Appwrite/config";
import { Button, Input, Select } from "../index";
import { useForm } from "react-hook-form";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    if (post) {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;
    }

    if (file) {
      appwriteService.deleteFile(post.featuredImage);
    }

    const dbPost = await appwriteService.updatePost(post.$id, {
      ...data,
      featuredImage: file ? file.$id : undefined,
    });

    if (dbPost) {
      navigate(`/posts/${dbPost.$id}`);
    } else {
      const file = await appwriteService.uploadFile(data.image[0]);

      const fileId = file.$id;
      data.featuredImage = fileId;

      const dbpost = await appwriteService.createPost({
        ...data,
        userId: userData.$id,
      });

      if (dbpost) {
        navigate(`/post/${dbpost.$id}`);
      }
    }
  };

const slugTransform = useCallback((value)=>{
if(value&& typeof value === "string")

return value 
.trim()
.toLowerCase
.replace(/[^a-zA-Z\d\s]+/g, "-")
.replace(/\s/g, "-");

return ""
},[])

React.useEffect(() => {
    const subscription = watch((value, { name }) => {
        if (name === "title") {
            setValue("slug", slugTransform(value.title), { shouldValidate: true });
        }
    });

    return () => subscription.unsubscribe();
}, [watch, slugTransform, setValue]);


}