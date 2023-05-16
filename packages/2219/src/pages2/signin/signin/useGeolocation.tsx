import { useCallback, useEffect, useRef, useState } from 'react';
import {
  startBeaconDiscovery,
  onBeaconUpdate,
  stopBeaconDiscovery,
} from 'remax/ali';

const UUIDS = [
  'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
  '1918FC80-B111-3441-A9AC-B1001C2FE510',
];

function customerByteToHex(bytes: number[], length: number) {
  let hexStr = '';
  for (let i = 0; i < length; i++) {
    const newHexStr = bytes[i].toString(16); //bytes[i]&0xff;///16进制数
    if (newHexStr.length == 1) {
      hexStr = hexStr + '0' + newHexStr;
    } else {
      hexStr = hexStr + newHexStr;
    }
  }
  return hexStr;
}

export default () => {
  const [beacons, setBeacons] = useState<
    {
      id: string;
      rssi: number;
    }[]
  >([]);
  const beaconsRef = useRef<
    {
      id: string;
      rssi: number;
    }[]
  >([]);

  // >([{ id: '000027CE981C', rssi: -71 }]);
  // >([{ id: '00004E26FAB3', rssi: -65 }]);

  const [isBtFail, setIsBtFail] = useState(true);

  const btRef = useRef(false);
  const chekBt = useCallback(() => {
    console.log('chekBt startBeaconDiscovery');
    startBeaconDiscovery({
      uuids: UUIDS,
      success: (res) => {
        btRef.current = true;
        setIsBtFail(false);
        console.log('startBeaconDiscovery success', res);
      },
      fail: (res) => {
        setIsBtFail(true);
        console.log('startBeaconDiscovery fail', res);
      },
    });
  }, [setIsBtFail]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (btRef.current) {
        clearInterval(timer);
        return;
      }
      chekBt();
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, [chekBt]);

  useEffect(() => {
    return () => {
      stopBeaconDiscovery();
    };
  }, []);

  useEffect(() => {
    onBeaconUpdate({
      success: (beacons) => {
        const temp: {
          id: string;
          rssi: number;
        }[] = [];
        console.log(beacons, 'beacons');
        beacons.beacons.forEach((beacon) => {
          if (beacon.rssi !== 0) {
            const majorInt = parseInt(beacon.major);
            const majorBytes: number[] = [];
            majorBytes[0] = (majorInt >> 8) & 0xff;
            majorBytes[1] = majorInt & 0xff;

            const minorInt = parseInt(beacon.minor);
            const minorBytes = [];
            minorBytes[0] = (minorInt >> 8) & 0xff;
            minorBytes[1] = minorInt & 0xff;
            const majorHex = customerByteToHex(majorBytes, 2);
            const minorHex = customerByteToHex(minorBytes, 2);
            let mac = '';
            if (
              beacon.uuid.toUpperCase() ===
              'FDA50693-A4E2-4FB1-AFCF-C6EB07647825'
            ) {
              mac = '0001' + majorHex + minorHex;
            } else if (
              beacon.uuid.toUpperCase() ===
              '1918FC80-B111-3441-A9AC-B1001C2FE510'
            ) {
              mac = '0000' + majorHex + minorHex;
            }
            const rssiDate = beacon.rssi;
            const dic = {
              id: mac.toUpperCase(),
              rssi: rssiDate,
            };
            temp.push(dic);
            console.log(JSON.stringify(dic));
          }
        });
        beaconsRef.current = temp;
        setBeacons(temp);
      },
    });
  }, []);

  return { beacons, beaconsRef, isBtFail };
};
