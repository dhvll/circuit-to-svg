import type { PcbSilkscreenCircle } from "circuit-json"
import type { INode as SvgObject } from "svgson"
import {
  type Matrix,
  applyToPoint,
  toString as matrixToString,
} from "transformation-matrix"
import { SILKSCREEN_TOP_COLOR, SILKSCREEN_BOTTOM_COLOR } from "../colors"

export function createSvgObjectsFromPcbSilkscreenCircle(
  pcbSilkscreenCircle: PcbSilkscreenCircle,
  transform: Matrix,
): SvgObject[] {
  const {
    center,
    radius,
    layer = "top",
    pcb_silkscreen_circle_id,
    stroke_width = 1,
  } = pcbSilkscreenCircle

  if (
    !center ||
    typeof center.x !== "number" ||
    typeof center.y !== "number" ||
    typeof radius !== "number"
  ) {
    console.error("Invalid PCB Silkscreen Circle data:", { center, radius })
    return []
  }

  const [transformedX, transformedY] = applyToPoint(transform, [
    center.x,
    center.y,
  ])

  const transformedRadius = radius * Math.abs(transform.a)

  const transformedStrokeWidth = stroke_width * Math.abs(transform.a)

  const color =
    layer === "bottom" ? SILKSCREEN_BOTTOM_COLOR : SILKSCREEN_TOP_COLOR

  const svgObject: SvgObject = {
    name: "circle",
    type: "element",
    attributes: {
      cx: transformedX.toString(),
      cy: transformedY.toString(),
      r: transformedRadius.toString(),
      class: `pcb-silkscreen-circle pcb-silkscreen-${layer}`,
      stroke: color,
      "stroke-width": transformedStrokeWidth.toString(),
      "data-pcb-silkscreen-circle-id": pcb_silkscreen_circle_id,
    },
    value: "",
    children: [],
  }

  return [svgObject]
}
