import express from "express";

interface IController {
    initialRouter: () => void;
}
export default IController;