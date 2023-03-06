import React, { useState, useCallback } from 'react';
import { usePageEvent } from 'remax/macro';
import { Image } from 'remax/one';
import { createInnerAudioContext } from 'remax/wechat';
import { requirePlugin } from 'remax/macro';
import { IMAGE_DOMIN } from '@/config/constant';
import styles from './index.less';
import audioState from '@/stores/audio';
import { showToast } from '@kqinfo/ui';
import classNames from 'classnames';
const plugin = requirePlugin('WechatSI');
// import storage from '@/utils/storage';

/** 微信同声转译文档： https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx069ba97219f66d99&token=&lang=zh_CN#- */
export interface IProps {
  text: string;
  id: number | string;
  size?: 'small' | 'normal';
}

export interface TextSpeechType {
  /** 语音合成链接超时时间戳 如1525930552，超时后无法播放，可使用时间为3小时 */
  expired_time: number;
  /** 语音合成返回的语音地址，可自行下载使用 */
  filename: string;
  /** 原始文本 */
  origin: string;
  /** retcode == 0 时请求成功 */
  retcode: number;
}

export interface errorType {
  /** -20001语音合成语言格式出错, -20002输入的待合成格式不正确, -20003语音合成内部错误, -20005网络错误, -40001接口调用频率达到限制，请联系插件开发者*/
  retcode: -20001 | -20002 | -20003 | -20005 | -40001;
  /** 错误信息 */
  msg: string;
}

export default ({ text, id, size }: IProps) => {
  const { setInnerAudioContext, innerAudioContext, audioId, setAudioId } =
    audioState.useContainer();
  const [pay, setPay] = useState(false);
  const closeAudio = useCallback(() => {
    setPay(false);
    setAudioId('');
    if (innerAudioContext) {
      innerAudioContext.stop();
      innerAudioContext.destroy();
    }
  }, [innerAudioContext, setAudioId]);
  const textAudioStatus = useCallback(
    (src: string) => {
      setAudioId(id);
      const audioContext = createInnerAudioContext();
      audioContext.src = src; //设置音频地址
      audioContext.play(); //播放音频
      setPay(true);
      setInnerAudioContext(audioContext);
      audioContext.onEnded(() => {
        // 播放停止，销毁该实例,不然会出现多个语音重复执行的情况
        closeAudio();
      });
      audioContext.onStop(() => {
        closeAudio();
      });
      audioContext.onError(() => {
        closeAudio();
      });
    },
    [closeAudio, id, setAudioId, setInnerAudioContext],
  );
  const textAudio = useCallback(
    (text?: string) => {
      plugin.textToSpeech({
        lang: 'zh_CN', //代表中文
        tts: true, //是否对翻译结果进行语音合成，默认为false，不进行语音合成
        content: text, //要转为语音的文字
        success: (res: TextSpeechType) => {
          closeAudio();
          if (res.filename) {
            textAudioStatus(res.filename); //将文字转为语音后的路径地址
          }
        },
        fail: (res: errorType) => {
          showToast({
            icon: 'fail',
            title: res.msg || '语音播放失败，请稍后重试!',
          });
        },
      });
    },
    [closeAudio, textAudioStatus],
  );
  usePageEvent('onHide', () => closeAudio());
  return (
    <>
      {pay && id === audioId ? (
        <Image
          onTap={closeAudio}
          src={`${IMAGE_DOMIN}/home/ear.gif`}
          mode="aspectFit"
          className={classNames(styles.img, {
            [styles.small]: size === 'small',
          })}
        />
      ) : (
        <Image
          onTap={() => textAudio(text)}
          src={`${IMAGE_DOMIN}/home/ear.png`}
          mode="aspectFit"
          className={classNames(styles.img, {
            [styles.small]: size === 'small',
          })}
        />
      )}
    </>
  );
};
