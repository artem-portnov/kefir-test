import React, {useState, useEffect} from "react";
import getDataRequest from "../data/getDataRequest";
import likeSVG from "../../../assets/like.svg"
import "./styles.scss";


interface CommentsDataType {
    id: number;
    created: string;
    text: string;
    author: number;
    parent: number | null;
    likes: number;
    children?: any;
}
interface AuthorsDataType {
    id: number;
    name: string;
    avatar: string;
}

const CommentsList = () => {
    const [comments, setComments] = useState<Array<CommentsDataType>>([])
    const [authors, setAuthors] = useState<Array<AuthorsDataType>>([])
    const [error, setError] = useState(false)

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        getDataRequest().then(res => {
            console.log('get data', res)
            setError(false)
            setAuthors(res.authors)
            setComments(formattedComments(res.comments))
        }).catch(err => {
            setError(true)
            console.log('err', err)
        })
    }

    const formatDate = (date: any) => {
        const formatTens = (el: string) => {
            if (+el < 10) el = '0' + el;
            return el
        }
        const d = formatTens(date.getDate()),
            mo = formatTens(date.getMonth() + 1),
            y = date.getFullYear(),
            h = formatTens(date.getHours()),
            mi = formatTens(date.getMinutes()),
            s = formatTens(date.getSeconds())

        return `${d}.${mo}.${y} ${h}:${mi}:${s}`
    }

    const formattedComments = (data: Array<CommentsDataType>) => {
        // отсортировал по id в обратном порядке, что бы, если есть родительский комментарий, присвоить текущий ему
        // + время создания комментариев прыгают относительно id. это как-то странно для входных данных
        const newDate:Array<CommentsDataType> = []
        data.sort((a: any, b: any) => (b.id - a.id))
            .forEach((el: any) => {
            if (el.parent === null) {
                newDate.push(el)
            }
            else {
                const i = data.findIndex(item => {
                    return item.id === el.parent
                })
                if (i !== -1) {
                    data[i] = {
                        ...data[i],
                        children: data[i].hasOwnProperty('children')
                            ? [...data[i].children, el]
                            : [el]
                    }
                }
            }
        })
        return newDate
    }

    const getAuthorInfo = (id: number) => {
        return authors.find(el => el.id === id)
    }

    const CommentsRender = () => {
        return (
            <div>
                {comments.map((element: any) => {
                    return (
                        <ItemRender key={element.id} item={element}/>
                    )
                })}
            </div>
        )
    }

    const ItemRender = (props: any) => {
        const { item } = props
        const author: any = getAuthorInfo(item.author)
        return (
            <div className={'c-comment_branch'}>
                <div className={'c-comment_container'}>
                    <div className={'c-comment_header'}>
                        <div className={'c-comment_photo'}>
                            <img src={author.avatar} alt=""/>
                        </div>
                        <div>
                            <div className={'c-comment_name'}>{author.name}</div>
                            <div className={'c-comment_date'}>{formatDate(new Date(item.created))}</div>
                        </div>
                        <div className={'c-comment_like'}>
                            <a href={void(0)}>
                                <img src={likeSVG} alt="like"/>
                            </a>
                            <span>
                                {item.likes}
                            </span>
                        </div>
                    </div>
                    <div className={'c-comment_txt'}>{item.text}</div>
                </div>

                {item.children && item.children.map((element: any) => {
                    return <ItemRender key={element.id} item={element}/>
                })}
            </div>
        )
    }

    return (
        <div>
            {error ? (
                <>
                    <div className={'c-error'}>Ошибка получения данных. Попробуйте позднее или повторите попытку</div>
                    <button onClick={getData}>Еще раз</button>
                </>
            ) : (
                <CommentsRender/>
            )}
        </div>
    );
};

export default CommentsList;
