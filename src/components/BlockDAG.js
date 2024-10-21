import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  getBlockdagInfo,
  getFeeEstimate,
  getHashrateMax,
  getKaspadInfo,
} from "../kaspa-api-client";
import { numberWithCommas } from "../helper";
import { BPS, KASPA_UNIT } from "../explorer_constants";

const BlockDAGBox = () => {
  const [virtualDaaScore, setVirtualDaaScore] = useState(
    localStorage.getItem("cacheVirtualDaaScore") || "",
  );
  const [hashrate, setHashrate] = useState(
    localStorage.getItem("cacheHashrate"),
  );
  const [mempoolView, setMempoolView] = useState(0);
  const [maxHashrate, setMaxHashrate] = useState(
    localStorage.getItem("cacheHashrateMax"),
  );
  const [feerate, setFeerate] = useState(localStorage.getItem("feerate"));
  const [mempool, setMempool] = useState(localStorage.getItem("mempool"));

  const initBox = async () => {
    const dag_info = await getBlockdagInfo();
    const hashrateMax = await getHashrateMax();
    const feeEstimate = await getFeeEstimate();
    const kaspadInfo = await getKaspadInfo();

    setVirtualDaaScore(dag_info.virtualDaaScore);
    localStorage.setItem("cacheVirtualDaaScore", dag_info.virtualDaaScore);
    setHashrate(dag_info.difficulty * 2 * BPS);
    localStorage.setItem("cacheHashrate", (dag_info.difficulty * 2).toFixed(2));
    setMaxHashrate(hashrateMax.hashrate * 1000 * 1000 * 1000 * 1000);
    localStorage.setItem("cacheHashrateMax", hashrateMax.hashrate);
    setFeerate(feeEstimate.normalBuckets[0].feerate);
    localStorage.setItem("feerate", feeEstimate.priorityBucket.feerate);
    setMempool(kaspadInfo.mempoolSize);
    localStorage.setItem("mempool", kaspadInfo.mempoolSize);
  };

  useEffect(() => {
    initBox();
    const updateInterval = setInterval(async () => {
      const dag_info = await getBlockdagInfo();
      setVirtualDaaScore(dag_info.virtualDaaScore);
      setHashrate(dag_info.difficulty * 2 * BPS);
      localStorage.setItem(
        "cacheHashrate",
        ((dag_info.difficulty * 2) / 1000000000000).toFixed(2),
      );
    }, 60000);

    const updateInterval2 = setInterval(async () => {
      const feeEstimate = await getFeeEstimate();
      const kaspadInfo = await getKaspadInfo();
      setFeerate(feeEstimate.normalBuckets[0].feerate);
      localStorage.setItem("feerate", feeEstimate.priorityBucket.feerate);
      setMempool(kaspadInfo.mempoolSize);
      localStorage.setItem("mempool", kaspadInfo.mempoolSize);
    }, 5000);

    return async () => {
      clearInterval(updateInterval);
      clearInterval(updateInterval2);
    };
  }, []);

  useEffect(() => {
    // slowly in- or decrease
    let start = mempoolView;
    let end = mempool;
    let steps = 400;
    let stepSize = (end - start) / (steps - 1);
    let stepsArr = Array.from({ length: steps }, (_, i) =>
      Math.floor(start + i * stepSize),
    );
    var cnt = 0;
    var updaterInterval = setInterval(() => {
      // console.log(stepsArr)
      setMempoolView(stepsArr[cnt]);

      if (++cnt === stepsArr.length) {
        clearInterval(updaterInterval);
      }
    }, 10);
  }, [mempool, mempoolView]);

  useEffect(
    (e) => {
      document.getElementById("feerate").animate(
        [
          // keyframes
          { opacity: "1" },
          { opacity: "0.6" },
          { opacity: "1" },
        ],
        {
          // timing options
          duration: 300,
        },
      );
      document.getElementById("feerateReg").animate(
        [
          // keyframes
          { opacity: "1" },
          { opacity: "0.6" },
          { opacity: "1" },
        ],
        {
          // timing options
          duration: 300,
        },
      );
    },
    [feerate],
  );

  useEffect(
    (e) => {
      document.getElementById("virtualDaaScore").animate(
        [
          // keyframes
          { opacity: "1" },
          { opacity: "0.6" },
          { opacity: "1" },
        ],
        {
          // timing options
          duration: 300,
        },
      );
    },
    [virtualDaaScore],
  );

  useEffect(
    (e) => {
      document.getElementById("hashrate").animate(
        [
          // keyframes
          { opacity: "1" },
          { opacity: "0.6" },
          { opacity: "1" },
        ],
        {
          // timing options
          duration: 300,
        },
      );
    },
    [hashrate],
  );

  function hashrateToStr(inHashrate) {
    if (inHashrate < 1000) {
      return `${(inHashrate / 1).toFixed(2)} H/s`;
    } else if (inHashrate < 1000 * 1000) {
      return `${(inHashrate / 1000).toFixed(2)} KH/s`;
    } else if (inHashrate < 1000 * 1000 * 1000) {
      return `${(inHashrate / 1000 / 1000).toFixed(2)} MH/s`;
    } else if (inHashrate < 1000 * 1000 * 1000 * 1000) {
      return `${(inHashrate / 1000 / 1000 / 1000).toFixed(2)} GH/s`;
    } else if (inHashrate < 1000 * 1000 * 1000 * 1000 * 1000) {
      return `${(inHashrate / 1000 / 1000 / 1000 / 1000).toFixed(2)} TH/s`;
    } else if (inHashrate < 1000 * 1000 * 1000 * 1000 * 1000 * 1000) {
      return `${(inHashrate / 1000 / 1000 / 1000 / 1000 / 1000).toFixed(2)} PH/s`;
    } else {
      return `${(inHashrate / 1000 / 1000 / 1000 / 1000 / 1000 / 1000).toFixed(2)} EH/s`;
    }
  }

  return (
    <>
      <div className="cardBox mx-0">
        <table style={{ fontSize: "1rem" }}>
          <tr>
            <td
              colspan="2"
              className="text-center"
              style={{ fontSize: "4rem" }}
            >
              <FontAwesomeIcon icon={faDiagramProject} />
              <div className="cardLight" />
            </td>
          </tr>
          <tr>
            <td colspan="2" className="text-center">
              <h3>NETWORK INFO</h3>
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Network name</td>
            <td className="pt-1 text-nowrap">
              KASPA {process.env.REACT_APP_NETWORK.toUpperCase()}
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Virtual DAA Score</td>
            <td className="pt-1 align-top" id="virtualDaaScore">
              {numberWithCommas(virtualDaaScore)}
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Hashrate</td>
            <td className="pt-1" id="hashrate">
              {hashrateToStr(hashrate)}
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Max Hashrate</td>
            <td className="pt-1" id="hashrate">
              {hashrateToStr(maxHashrate)}
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Mempool size</td>
            <td className="pt-1" id="mempool">
              {numberWithCommas(mempoolView)}
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Current Normal Fee</td>
            <td className="pt-1" id="feerate">
              {feerate} Sompi / gram
            </td>
          </tr>
          <tr>
            <td className="cardBoxElement">Fee for regular TX</td>
            <td className="pt-1" id="feerateReg">
              ≈{" "}
              {feerate > 300
                ? ((feerate * 3165) / 100000000).toFixed(2)
                : (feerate * 3165) / 100000000}{" "}
              {KASPA_UNIT}
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default BlockDAGBox;
