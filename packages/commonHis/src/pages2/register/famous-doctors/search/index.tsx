import { View, InputProps, TextareaProps } from 'remax/one';
import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import {
  NeedWrap,
  Shadow,
  Icon,
  Space,
  showToast,
  Exceed,
  ReInput as Input,
} from '@kqinfo/ui';
import { PLATFORM } from '@/config/constant';
// import { useDebounceFn, useMount } from 'ahooks';
import globalState from '@/stores/global';
import styles from './index.less';
import storage from '@/utils/storage';
import { checkChinese } from '@/utils';

export interface Props
  extends Omit<InputProps & TextareaProps, 'onConfirm' | 'onInput'> {
  /**
   * 确认事件
   */
  onConfirm?: (value?: string) => void;
  /**
   * 显示搜索按钮
   */
  showBtn?: boolean;
  /**
   * 搜索按钮类名
   */
  btnCls?: string;
  /**
   * 图标的颜色
   */
  iconColor?: string;
  /**
   * 输入框wrap类名
   */
  inputWrapCls?: string;
  /**
   * 输入框类名
   */
  inputCls?: string;
  /**
   * 搜索按钮样式
   */
  btnStyle?: React.CSSProperties;
  /**
   * 输入框wrap样式
   */
  inputWrapStyle?: React.CSSProperties;
  /**
   * 阴影
   */
  shadow?: boolean;
  defaultSearchVal?: string;
  isHotSearch?: boolean;
}

export default ({
  showBtn,
  style,
  btnCls,
  iconColor = '#ccc',
  inputWrapStyle,
  inputCls,
  className,
  inputWrapCls,
  btnStyle,
  shadow,
  isHotSearch = false,
  ...props
}: Props) => {
  const { searchQ, setSearchQ } = globalState.useContainer();
  const data = storage.get('search_doctor');
  const [searchStorage, setSearchStorage] = useState(
    data ? JSON.parse(data) : [],
  );
  const setSearchDoctorData = useCallback((v: string) => {
    if (checkChinese(v)) {
      const data = storage.get('search_doctor');
      let newData = data ? JSON.parse(data) : [];
      newData.unshift(v);
      newData = Array.from(new Set(newData)).slice(0, 4);
      storage.set(
        'search_doctor',
        JSON.stringify(Array.from(new Set(newData))),
      );
      setSearchStorage(newData);
    }
  }, []);
  // const { run } = useDebounceFn(
  //   (v) => {
  //     if (v) {
  //       props.onConfirm?.(v);
  //       setSearchDoctorData(v);
  //     }
  //   },
  //   {
  //     wait: 2000,
  //   },
  // );
  const onSubmit = useCallback(
    (val) => {
      if (!val) {
        return;
      }
      if (!checkChinese(val)) {
        showToast({
          icon: 'none',
          title: '请输入正确的汉字!',
        });
        return;
      }
      setSearchDoctorData(val);
      props.onConfirm?.(val);
    },
    [props, setSearchDoctorData],
  );
  // useMount(() => {
  //   if (defaultSearchVal) {
  //     setSearchDoctorData(defaultSearchVal);
  //     props.onConfirm?.(defaultSearchVal);
  //   }
  // });
  return (
    <Space vertical className={styles.search}>
      <View className={classNames(styles.wrap, className)} style={style}>
        <NeedWrap wrap={Shadow} need={!!shadow}>
          <View
            className={classNames(styles.inputWrap, inputWrapCls)}
            style={inputWrapStyle}
          >
            <Icon
              className={classNames(styles.icon, {
                [styles.iconColorWeb]: PLATFORM === 'web',
              })}
              color={iconColor}
              name={'kq-search'}
            />
            <Input
              className={classNames(styles.input, inputCls)}
              placeholderStyle={{ color: '#999999' }}
              onChange={(value = '') => {
                setSearchQ(value);
              }}
              type="text"
              maxLength={10}
              enable-native="{{enableNative}}"
              value={searchQ}
              placeholder={props.placeholder}
              onConfirm={onSubmit}
            />
            <View
              onTap={() => {
                setSearchQ('');
              }}
              style={{
                opacity: searchQ ? 1 : 0,
              }}
              className={styles.clear}
            >
              <Icon name={'kq-clear2'} color={iconColor} />
            </View>
          </View>
        </NeedWrap>
        {showBtn && (
          <View
            className={classNames(styles.btn, btnCls)}
            onTap={() => onSubmit(searchQ)}
            style={btnStyle}
          >
            搜索
          </View>
        )}
      </View>
      {isHotSearch && (
        <Space className={styles.tagWrap} alignItems="center">
          <View className={styles.tagWrapTitle}>热门搜索</View>
          <Space className={styles.tags} flexWrap="wrap">
            {searchStorage.map((item: string, index: number) => (
              <Space
                justify="center"
                alignItems="center"
                flex="auto"
                key={index}
                className={styles.tag}
                onTap={() => {
                  setSearchQ(item);
                  props.onConfirm?.(item);
                }}
              >
                <Exceed clamp={1}>{item}</Exceed>
              </Space>
            ))}
          </Space>
        </Space>
      )}
    </Space>
  );
};
