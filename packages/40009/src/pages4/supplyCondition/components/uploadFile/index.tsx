import { View, Text, Image } from '@remax/one';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import styles from './index.module.less';
import { useRefState, useStateRef } from 'parsec-hooks';
import { selectFiles, Icon, getPlatform, Video } from '@kqinfo/ui';

interface ReadOnly {
  /**
   * 是否可以添加
   * @default true
   */
  addable: boolean;
  /**
   * 是否可以删除
   * @default true
   */
  deletable: boolean | ((url: string, index: number) => boolean);
}

export const readOnly = ({}: ReadOnly) => {};

interface Props {
  /**
   * 图片数量
   * @default 1
   */
  length?: number;
  /**
   * 是否可以多选
   * @default false
   */
  multiple?: boolean;
  /**
   * 上传方法
   */
  uploadFn: (file: File) => Promise<string>;
  /**
   * 上传文件最大大小
   * 计算方式 MB * 1024 * 1024 如：1M 写做：1 * 1024 * 1024
   */
  maxSize?: number;
  /**
   * 上传文件过大报错
   */
  onMaxError?: () => void;
  /**
   * 上传文件之前
   */
  beforeUpload?: (file: File) => boolean | Promise<File>;
  /**
   * 上传上传报错
   */
  onError?: (value: string) => void;
  /**
   * value值
   */
  value?: string[];
  /**
   * onChange事件
   */
  onChange?: (value?: string[]) => void;
  /**
   * 自定义添加按钮
   */
  addBtn?: React.ReactElement;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 没有数据时的提示
   */
  tip?: React.ReactNode;
  /**
   * 上传项类名
   */
  itemCls?: string;
  /**
   * 类名
   */
  className?: string;
  /**
   * 自定义删除图标
   */
  delIcon?: React.ReactNode;
  /**
   * 删除图标类名
   */
  delIconCls?: string;
  /**
   * 只有小程序支持，选择图片的来源
   */
  sourceType?: Array<'album' | 'camera'>;
  /**
   * 只读模式
   * @default false
   */
  readOnly?: boolean | ReadOnly;
  accept?: string;
}

export default ({
  length = 1,
  uploadFn,
  maxSize,
  onMaxError,
  onError,
  beforeUpload = () => true,
  value = [],
  onChange,
  addBtn,
  style,
  delIcon = <Icon name="kq-clear2" color="#EA5328" />,
  tip = (
    <View className={classNames(styles.promptText)}>
      <Text className={classNames(styles.promptText1)}>添加文件</Text>
      <Text className={classNames(styles.promptText2)}>最多上传{length}个</Text>
    </View>
  ),
  className,
  delIconCls,
  itemCls,
  readOnly = false,
  accept = '.mp4',
}: Props) => {
  const [loadingArr, setLoadingArr, loadingArrRef] = useRefState<string[]>([]);
  const valueRef = useStateRef(value);
  const { addable = true, deletable = true } =
    readOnly === true
      ? {
          addable: false,
          deletable: false,
        }
      : readOnly
      ? readOnly
      : {};
  const showAddBtn = useMemo(() => {
    if (!addable && value.length + loadingArr.length === 0) {
      return true;
    }
    if (!addable) {
      return false;
    }
    return value.length + loadingArr.length < length;
  }, [addable, length, loadingArr.length, value.length]);
  const [preVideo, setPreVideo] = useState(undefined as any);

  return (
    <View className={classNames(styles.uploadImg, className)} style={style}>
      {[...value, ...loadingArr].map((item, index) => {
        const loading = loadingArr.includes(item);
        const canDel =
          typeof deletable !== 'boolean' ? deletable(item, index) : deletable;
        return (
          <View
            className={classNames(styles.uploadImgItem, itemCls)}
            key={index}
          >
            <Image
              className={classNames(styles.uploadImgItemImage)}
              src={`${item}?x-oss-process=video/snapshot,t_1000,m_fast`}
              key={index}
              onTap={() => {
                setPreVideo(item);
              }}
            />

            {loading ? (
              <View className={styles.loading}>
                <Icon name={'kq-loading'} color={'#fff'} />
              </View>
            ) : (
              canDel && (
                <View
                  className={classNames(styles.uploadImgItemDelete, delIconCls)}
                  onTap={() => {
                    const temp = [...value];
                    temp.splice(index, 1);
                    onChange && onChange([...temp]);
                  }}
                >
                  {delIcon}
                </View>
              )
            )}
          </View>
        );
      })}
      {showAddBtn && (
        <View
          onTap={() => {
            if (!addable) {
              return;
            }
            if (valueRef.current.length >= length) {
              return;
            }
            selectFiles({ accept }).then(async (data: any) => {
              const tempData: string[] = [];
              console.log('data', data);
              for (const file of data) {
                const maxErrFn = () => maxSize && file.size > maxSize;
                try {
                  if (await maxErrFn()) {
                    if (onMaxError) {
                      onMaxError();
                    }
                    onError && onError('beforeUpload');
                    return;
                  }
                  const result = await beforeUpload(file as any);
                  let tempFile = file;

                  if (typeof result === 'boolean') {
                    if (!result) {
                      return;
                    }
                  } else {
                    tempFile = result as any;
                  }
                  const fileUrl: any =
                    getPlatform === 'web' && tempFile instanceof File
                      ? URL.createObjectURL(tempFile)
                      : tempFile;

                  setLoadingArr([...loadingArrRef.current, fileUrl]);

                  await uploadFn(tempFile as any)
                    .then((url) => {
                      console.log('url', url);
                      loadingArrRef.current.splice(
                        loadingArrRef.current.findIndex((i) => i === fileUrl),
                        1,
                      );
                      setLoadingArr([...loadingArrRef.current]);
                      tempData.push(url);
                    })
                    .catch(onError);
                } catch (e) {
                  console.log(e);
                  onError && onError('beforeUpload');
                }
              }

              const temp = [...valueRef.current, ...tempData].slice(0, length);
              onChange && onChange([...temp]);
            });
          }}
        >
          {addBtn || (
            <View className={classNames(styles.uploadImgIcon)}>
              <Icon
                className={classNames(styles.uploadImgIconAdd)}
                name="kq-add"
                color="#999999"
              />
            </View>
          )}
        </View>
      )}
      {!(value?.length + loadingArr.length) && tip}
      {preVideo && (
        <View className={styles.showVideo}>
          <View
            className={styles.mask}
            onTap={() => {
              setPreVideo(undefined);
            }}
          />
          <Video src={preVideo} className={styles.video} />
        </View>
      )}
    </View>
  );
};
