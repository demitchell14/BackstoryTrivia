import * as express from "express";

export function exec(req, res, next) {
    res.send("Hello World!");
}