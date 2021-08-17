import React, {useEffect, useMemo, useState} from "react";
import "./SuggestionList.scss";
import {Button, Card} from "antd";
import Suggestion from "./Suggestion";
import {useAppContext} from "../store";
import {useAxios, axiosInstance} from "../api";

export default function SuggestionList({style}) {
    const {store: {jwtToken}} = useAppContext()

    const [userList, setUserList] = useState([]);

    const headers = {Authorization: `JWT ${jwtToken}`}
    const [{data: originUserList, loading, error}, refetch] = useAxios({
        url: "/accounts/suggestions/",
        headers,
    });

    useEffect(()=> {
        if (!originUserList )
            setUserList([]);
        else
            setUserList(originUserList.map(user => ({ ...user, is_follow: false})));
    }, [originUserList]);

    const onFollowUser = (username) => {
        const data = {username};
        const config = {headers};
        axiosInstance.post("/accounts/follow/",data , config )
            .then(response => {
                setUserList(prevUserList =>
                    prevUserList.map(user =>
                        user.username !== username ? user : {...user, is_follow: true}
                    ));
            })
            .catch(error => {
                console.error(error);
            })

    }

    return (
        <div style={style}>
            {loading && <div>Loading...</div>}
            {error && <div>로딩 중에 에러가 발생했습니다.</div>}
            <button onClick={() => refetch}>Reload</button>

            <Card title="Suggestions for you" size="small">
                {userList.map(suggestionUser => {
                    return <Suggestion key={suggestionUser.username} suggestionUser={suggestionUser} onFollowUser={onFollowUser}/>
                })}
            </Card>
        </div>);
}
