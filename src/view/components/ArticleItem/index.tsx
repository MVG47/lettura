import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Icon } from '../Icon';
import { ArticleReadStatus } from '../../../infra/constants/status';
import { Article } from '../../../infra/types';
import { openBrowser } from '../../../infra/utils';
import styles from './articleitem.css';
import { useDataProxy } from '../../hooks/useDataProxy';

type ArticleItemProps = {
  article: Article;
};

function createMarkup(html: string) {
  return { __html: html };
}

export const ArticleItem = (props: ArticleItemProps) => {
  const dataProxy = useDataProxy();
  const { article } = props;
  const [expand, setExpand] = useState(false);
  const [readStatus, setReadStatus] = useState(false);

  const content = useMemo(() => {
    return (
      <div
        className={styles.content}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={createMarkup(article.content)}
      />
    );
    // const str = article.content.replace(/(<([^>]+)>)/gi, '');
    //
    // if (str.length > 250) {
    //   return `${str.slice(0, 250)}...`;
    // }
    //
    // return str;
  }, [article]);

  const handleClick = useCallback(() => {
    setExpand(!expand);
  }, [expand]);

  const openWebPage = useCallback(
    (e) => {
      openBrowser(article.link);
      e.stopPropagation();
    },
    [article]
  );

  const markAsRead = useCallback(
    (e) => {
      e.stopPropagation();
      dataProxy
        .markAsRead(article)
        .then((result: boolean) => {
          setReadStatus(result);
          return result;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [dataProxy, article]
  );

  useEffect(() => {
    setReadStatus(article.hasRead === ArticleReadStatus.isRead);
  }, [article]);

  return (
    <li
      className={`${styles.item} ${readStatus && styles.read} ${
        expand && styles.expand
      }`}
      onClick={handleClick}
      aria-hidden="true"
    >
      <div className={styles.header}>
        <div className={styles.title}>{article.title}</div>
        <div className={styles.actions}>
          <Icon customClass={styles.icon} name="bookmark_add" />
          <Icon customClass={styles.icon} name="favorite_border" />
          <Icon customClass={styles.icon} name="done" onClick={markAsRead} />
          <Icon customClass={styles.icon} name="launch" onClick={openWebPage} />
        </div>
      </div>
      {expand && <div className={styles.content}>{content}</div>}
    </li>
  );
};