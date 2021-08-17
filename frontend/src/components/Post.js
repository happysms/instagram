import React from "react";
import {Avatar, Card, Comment, Input, Tooltip } from "antd";
import "./Post.scss"
import {HeartOutlined, HeartFilled, UserOutlined, HeartTwoTone } from "@ant-design/icons"
import useAxios from "axios-hooks";
import Axios from "axios";
import moment from "moment"
import {useAppContext} from "../store";
import CommentList from "./CommentList";

function Post({post, handleLike}) {


    const { author, caption, location, photo, tag_set, is_like } = post;
    const {username, name, avatar_url} = author;

    return (
        <div>
            <Card
                hoverable
                cover={<img src={photo} alt={caption}/>}
                actions={[
                    (is_like ? <HeartTwoTone twoToneColor="#eb2f96" onClick={() => handleLike({post, isLike: false})}/>
                        : <HeartOutlined onClick={() => handleLike({post, isLike: true})}/>),
                ]}
            >
                <Card.Meta
                    avatar={
                        <Avatar
                            size="large"
                            icon={<img src={avatar_url} alt={username}/>}
                        />
                    }
                    title={location}
                    desription={caption}
                    style={{marginBottom: "0.5em"}}
                />

                <CommentList post={post} />
            </Card>

        </div>);
}

export default Post;
