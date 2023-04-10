import React from 'react';
import { View, Text } from 'remax/one';
import { HOSPITAL_NAME, HOSPITAL_TEL } from '@/config/constant';
import { usePageEvent } from 'remax/macro';
import setNavigationBar from '@/utils/setNavigationBar';
import styles from './index.less';

export default () => {
  usePageEvent('onShow', () => {
    setNavigationBar({
      title: '用户授权协议',
    });
  });
  return (
    <View className={styles.page}>
      <View className={styles.title}>
        {HOSPITAL_NAME}智慧医疗服务平台用户授权协议
      </View>
      <View className={styles['first-content']}>
        《用户授权协议》（以下简称“本协议”）是{HOSPITAL_NAME}
        （以下简称“本院”）与用户（以下简称“您”）所订立的有效合约。您正在使用的是本院依托于微信、支付宝、PC端（包括但不限于）搭建的智慧医疗服务平台（以下简称”平台“）。
        <Text className={styles.bold}>
          请您先仔细阅读本协议内容，尤其是字体加粗部分。如您对本协议内容或页面提示信息有疑问，请勿进行下一步操作。您可拨打本院热线
          {HOSPITAL_TEL}
          进行咨询，以便我们为您解释和说明。如您点击”授权登录“或任何使用平台行为，包括注册、登录、查看、发布信息等，均表示您已同意本协议。
        </Text>
      </View>
      <View className={styles['item-content']}>
        <View className={styles['item-title']}>一、服务内容</View>
        <View className={styles.margin}>
          <Text className={styles.bold}>
            1.
            平台为您提供线上和线下诊疗服务，其中，线上诊疗服务不涉及面诊、触诊、初诊，医生仅根据患者提供的信息和初诊数据提供复诊服务，
          </Text>
          线上诊疗仅服务部分慢性病、常见病、多发病等复诊患者，不接受初诊患者或未明确诊断、疑难病、罕见病等疾病患者，或者远程医疗不能解决的复杂问题。
        </View>
        <View className={styles.margin}>
          <Text className={styles.bold}>
            2.
            平台为您提供健康咨询服务，咨询服务不限定复诊病人，医务人员利用所掌握的医学知识及临床经验给予相关的咨询建议，不涉及诊断与处方服务。
          </Text>
        </View>
        <View className={styles.margin}>
          <Text className={styles.bold}>
            3.
            您在线上绑卡的过程中需提供真实、完整、详细的信息，线下就医将以此为基准。
          </Text>
          若您使用虚假身份信息或者冒用他人信息，本院有权拒绝为您提供就医服务，由此造成的不良后果，一切由您本人负责。
        </View>
        <View className={styles.margin}>
          <Text className={styles.bold}>
            4. 检查检验的报告数据，住院日清单的数据，请您以线下为准。
          </Text>
          智慧医疗服务平台为您提供的数据仅供参考，不得作为就医凭证或者其他凭证。
        </View>
      </View>
      <View className={styles['item-content']}>
        <View className={styles['item-title']}>二、使用权责</View>
        <View className={styles.margin}>
          <Text className={styles.bold}>
            1.
            用户如提供虚假信息或实施其他违反本协议的行为，平台有权立即终止对用户提供全部或部分服务。
          </Text>
        </View>
        <View className={styles.margin}>
          2.
          用户需承担包括但不限于如下违反相关法律法规或违反平台规则情形造成的全部责任：
          <View>
            （1）提供信息不完整、不真实、不准确，导致线下无法正常就医的；
          </View>
          <View>（2）利用不正当手段获取号源的；</View>
          <View>
            （3）患者及近亲属不配合或干扰医疗机构进行符合诊疗规范的诊疗；
          </View>
        </View>
        <View className={styles.margin}>
          3.
          用户需保障和维护平台的利益，用户如在使用过程中实施不正当行为而给平台、平台医生或其他第三方造成任何损失，平台有权终止服务，由此造成的法律和经济后果由用户承担，不正当行为包含但不限于以下方面：
          <View className={styles.margin}>
            （1）用户发布有医托、强烈广告性质内容的行为；
          </View>
          <View className={styles.margin}>
            （2）用户从中国境内向境外传输技术性资料时有违背中国有关法律法规行为；
          </View>
          <View className={styles.margin}>
            （3）用户使用平台提供的服务从事洗钱、窃取商业秘密等非法行为；
          </View>
          <View className={styles.margin}>
            （4）用户以包括但不限于盗用他人账号、恶意编造或虚构信息、恶意投诉、未经允许进入他人电脑或手机系统或平台系统等方式干扰平台服务；
          </View>
          <View className={styles.margin}>
            （5）用户有传输非法、骚扰性、影射或中伤他人、辱骂性、恐吓性、伤害性、庸俗、带有煽动性、可能引起公众恐慌、淫秽的、散播谣言等信息资料的行为；
          </View>
          <View className={styles.margin}>
            （6）用户有传输教唆他人构成犯罪行为、危害社会治安、侵害自己或他人人身安全的资料，或传输助长国内不利条件和涉及损害国家安全和社会公共利益的资料，或传输不符合当地法规、国家法律和国际法律的资料的行为；
          </View>
          <View className={styles.margin}>
            （7）用户有发布涉及政治、性别、种族歧视或攻击他人的文字、图片或语言等信息；
          </View>
          <View className={styles.margin}>
            （8）用户有其他发布违法信息、严重违背社会公德、违背本协议或补充协议、违反法律禁止性规定的行为。
          </View>
        </View>
      </View>
      <View className={styles['item-content']}>
        <View className={styles['item-title']}>三、特别授权</View>
        <View className={styles.margin}>
          <Text className={styles.bold}>
            为了便于您使用第三方服务，您同意本院将您的用户编号及页面相关信息传递给第三方。页面提示上会展示您需要授权的对象以及授权信息类型，您的信息将通过加密通道传递给第三方。
          </Text>
          本院会要求第三方严格遵守相关法律规定于监管要求，依法使用您的信息，并对您的信息保密。点击授权后，授权关系长期有效，直至您主动解除。
        </View>
      </View>
      <View className={styles['item-content']}>
        <View className={styles['item-title']}>四、第三方服务使用须知</View>
        <View className={styles.margin}>
          <Text className={styles.bold}>
            您须知，上述第三方服务由该第三方独立运营并独立承担全部责任。因第三方服务或其使用您的信息而产生的纠纷，或第三方服务违反相关法律法规或协议约定，或您在使用第三方服务过程中遭受损失的，请您和第三方协商解决。
          </Text>
        </View>
      </View>
      <View className={styles['item-content']}>
        <View className={styles['item-title']}>五、知识产权</View>
        <View>
          您同意并已充分了解本协议的条款，承诺不将本院已发表于平台的信息，以任何形式发布或授权其它主体以任何方式使用（包括但不限于在各类网站、媒体上使用）。
          <Text className={styles.bold}>
            除法律另有强制性规定外，未经平台书面许可，任何单位或个人不得以任何方式全部或部分复制、转载、引用、链接、抓取或以其他方式使用平台的信息内容，如有违反，本院有权追究其法律责任。
          </Text>
        </View>
      </View>
      <View className={styles['item-content']}>
        <View className={styles['item-title']}>六、协议的中止或终止</View>
        <View>
          <Text className={styles.bold}>
            您在使用平台时，应严格遵守本协议的约定。
          </Text>
          本院有权视用户的行为性质，在不事先通知用户的情况下，采取包括但不限于中断使用许可、限制使用、中止或终止服务、追究法律责任等措施，若因此造成本院或他人损失的，用户应予赔偿。
        </View>
      </View>
      <View className={styles['item-content']}>
        <View className={styles['item-title']}>七、协议变更</View>
        <View>
          <Text className={styles.bold}>
            若我们对本协议进行变更，本院将通过公告或客户端消息等方式予以通知，该等变更自通知载明的生效时间开始生效。若您无法同意变更修改后的协议内容，您有权停止使用相关服务；双方协商一致的，也可另行变更相关服务和对应协议内容。
          </Text>
        </View>
      </View>
      <View className={styles['item-content']}>
        <View className={styles['item-title']}>八、法律适用及其他</View>
        <View>
          本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国法律。因本协议产生的争议，均应依照中华人民共和国法律予以处理，并由被告住所地人民法院管辖。
        </View>
      </View>
    </View>
  );
};
