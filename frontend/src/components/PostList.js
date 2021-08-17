import React, {useEffect, useState} from "react";
import Post from "./Post";
import {useAppContext} from "../store";
import {Alert} from "antd";
import {axiosInstance, useAxios }from "api"

function PostList() {
    const { store: {jwtToken}, dispatch } = useAppContext();

    const [postList, setPostList] = useState([]);

    const headers = {Authorization: `JWT ${jwtToken}`}
    const [{data: originPostList, loading, error}, refetch] = useAxios({
        url: "/api/posts/",
        headers,
    });

    useEffect(()=>{
        setPostList(originPostList);
    }, [originPostList])

    const handleLike = async ({post, isLike}) => {
        const apiUrl = `/api/posts/${post.id}/like/`;
        const method = isLike ? "POST" : "DELETE";
        try {
            const response = await axiosInstance({
                url: apiUrl,
                method,
                headers,
            });
            console.log("response: " , response)

            setPostList(prevList => {
                return prevList.map(currentPost => {
                    return currentPost === post ? {...currentPost, is_like: isLike} : currentPost
                });
            })
        }
        catch(error) {
            console.log("error : ", error);
        }
    };

    return (
        <div>
            {postList && postList.length === 0 &&
            (<Alert type="warning" message="포스팅이 없습니다. :-("/>)
            }
            {postList && postList.map(post => {
                    return <Post post={post} key={post.id} handleLike={handleLike}/>
                }
            )}
        </div>
    );
}

export default PostList;


    // useEffect(() => {
    //     const headers = {Authorization : `JWT ${jwtToken}` };
    //
    //     Axios.get(apiUrl, { headers })
    //         .then(response => {
    //             const {data} = response;
    //             console.log("loaded response : ", response);
    //             setPostList(data);
    //         })
    //         .catch(error => {
    //             // error.response;
    //         })
    //     console.log("mounted");
    // }, []);
