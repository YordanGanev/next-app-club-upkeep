"use client";

import Style from "./styles/WindowFilter.module.css";

import { useContext } from "react";
import { PopoutContext } from "@contexts/PopoutContext";

export default function WindowFilter() {
  const { filterOpts } = useContext(PopoutContext);

  const block = filterOpts?.blockClick ? Style.block : null;
  const blur = filterOpts?.blur ? Style.blur : null;
  const darken = filterOpts?.darken ? Style.darken : null;

  // console.log(`${Style.wrapper} ${block} ${blur} ${darken}`);

  return <div className={`${Style.wrapper} ${block} ${blur} ${darken}`} />;
}
