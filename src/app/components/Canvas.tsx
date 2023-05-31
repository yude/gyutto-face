"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Konva from "konva";
import { Stage, Layer, Line, Circle } from "react-konva";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

export default function Canvas() {
  const [imageURL, _] = useState<string>();
  const [eyebrowsLevel, setEyebrowsLevel] = useState<number>(5);
  const [mousePosition, setMousePosition] = useState<number>(345);
  const [eyeScale, setEyeScale] = useState<number>(1);
  const stageRef = useRef<Konva.Stage>(null);

  const baseX = 350;

  useEffect(() => {
    if (stageRef && stageRef.current) {
      const stage = stageRef.current;
      const scaleBy = 1.5;
      stageRef.current.on("wheel", (e) => {
        e.evt.preventDefault();
        var oldScale = stage.scaleX();

        var center = {
          x: stage.width() / 2 + 65,
          y: stage.height() / 2,
        };

        var relatedTo = {
          x: (center.x - stage.x()) / oldScale,
          y: (center.y - stage.y()) / oldScale,
        };

        var newScale =
          e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        if (newScale > 11 || newScale < 0.03) {
          return;
        }

        stage.scale({
          x: newScale,
          y: newScale,
        });

        var newPos = {
          x: center.x - relatedTo.x * newScale,
          y: center.y - relatedTo.y * newScale,
        };

        stage.position(newPos);
        stage.batchDraw();
      });
    }
  }, []);

  const handleMouseChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMousePosition(parseInt(e.target.value));
  };

  const handleEyebrowsLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEyebrowsLevel(parseInt(e.target.value));
  };

  const handleEyeScaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEyeScale(parseInt(e.target.value));
  };

  function downloadURI(uri: string, name: string) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const handleSaveAsImage = () => {
    if (stageRef && stageRef.current) {
      const result = stageRef.current.toDataURL();
      console.log(result);
      downloadURI(result, "result.png");
    }
  };

  return (
    <>
      <img src={imageURL} />

      <div className="container mx-auto">
        <div>
          <Stage width={600} height={600} ref={stageRef}>
            <Layer>
              {/* 顔の輪郭 */}
              <Circle
                draggable
                x={baseX}
                y={300}
                radius={100}
                fill={"white"}
                stroke={"black"}
                strokeWidth={2}
              />

              {/* 左眉毛 */}
              <Line
                draggable
                points={[
                  baseX - 50,
                  250 + eyebrowsLevel,
                  baseX - 20,
                  250 - eyebrowsLevel,
                ]}
                stroke={"black"}
              />
              {/* 右眉毛 */}
              <Line
                draggable
                points={[
                  baseX + 20,
                  250 - eyebrowsLevel,
                  baseX + 50,
                  250 + eyebrowsLevel,
                ]}
                stroke={"black"}
              />

              {/* 左目の外輪郭 */}
              <Circle
                draggable
                x={baseX - 40}
                y={290}
                radius={20}
                fill={"white"}
                stroke={"black"}
                scaleX={1.1}
                scaleY={eyeScale / 10}
                strokeWidth={2}
              />

              {/* 左目の黒目 */}
              <Circle
                draggable
                x={baseX + 40}
                y={290}
                radius={20}
                fill={"white"}
                stroke={"black"}
                scaleX={1.1}
                scaleY={eyeScale / 10}
                strokeWidth={2}
              />

              {/* 閉じた左目 */}
              {eyeScale < 1 && (
                <Line
                  draggable
                  points={[baseX - 60, 290, baseX - 20, 290]}
                  stroke={"black"}
                />
              )}
              {/* 閉じた左目 */}
              {eyeScale < 1 && (
                <Line
                  draggable
                  points={[baseX + 20, 290, baseX + 60, 290]}
                  stroke={"black"}
                />
              )}

              {/* 左目の外輪郭 */}
              <Circle
                draggable
                x={baseX - 40}
                y={290}
                radius={10}
                fill={"black"}
                stroke={"black"}
                scaleX={1.1}
                scaleY={eyeScale / 10}
                strokeWidth={2}
              />

              {/* 右目の黒目 */}
              <Circle
                draggable
                x={baseX + 40}
                y={290}
                radius={10}
                fill={"black"}
                stroke={"black"}
                scaleX={1.1}
                scaleY={eyeScale / 10}
                strokeWidth={2}
              />

              {/* 口の上部分 */}
              <Line
                draggable
                points={[baseX - 35, 340, baseX + 35, 340]}
                stroke={"black"}
              />
              {/* 口の下部分 */}
              <Line
                draggable
                points={[
                  baseX - 35,
                  340,
                  baseX,
                  mousePosition,
                  baseX + 35,
                  340,
                ]}
                stroke={"black"}
                tension={0.4}
              />
            </Layer>
          </Stage>
        </div>

        <div>
          <Form.Label>開口度合い</Form.Label>
          <Form.Range
            value={mousePosition}
            onChange={handleMouseChange}
            min={340}
            max={365}
            style={{ width: "20rem", marginLeft: "18px", marginRight: "10px" }}
          />
          {((mousePosition - 340) * 100) / 25} %
        </div>
        <div>
          <Form.Label>開眼度合い</Form.Label>
          <Form.Range
            value={eyeScale}
            onChange={handleEyeScaleChange}
            min={0}
            max={11}
            style={{ width: "20rem", marginLeft: "18px", marginRight: "10px" }}
          />
          <span>{Math.round((eyeScale * 100) / 11)} %</span>
        </div>
        <div>
          <Form.Label>眉毛の垂れ具合</Form.Label>
          <Form.Range
            value={eyebrowsLevel}
            onChange={handleEyebrowsLevelChange}
            min={0}
            max={13}
            style={{ width: "20rem", marginLeft: "18px", marginRight: "10px" }}
          />
          <span>{Math.round((eyebrowsLevel * 100) / 13)} %</span>
        </div>
        <Button variant="outline-primary m-1" onClick={handleSaveAsImage}>
          <FontAwesomeIcon icon={faFloppyDisk} /> 画像として保存
        </Button>
        <div className="mt-5">
          <Link href="https://github.com/yude/gyutto-face">
            ソースコード (GitHub)
          </Link>
          <span> / &copy; 2023 yude, Licensed under the MIT.</span>
        </div>
      </div>
    </>
  );
}
