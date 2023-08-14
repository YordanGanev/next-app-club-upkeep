"use client";

import Style from "./styles/WindowFilter.module.css";

import { useContext } from "react";
import { PopoutContext } from "@/contexts/PopoutContext";

export default function WindowFilter() {
  const { filterOpts, formVisible } = useContext(PopoutContext);

  const block = filterOpts?.blockClick || formVisible ? Style.block : null;
  const blur = filterOpts?.blur ? Style.blur : null;
  const darken = filterOpts?.darken || formVisible ? Style.darken : null;

  return <div className={`${Style.wrapper} ${block} ${blur} ${darken}`} />;
}
