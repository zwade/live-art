import React from "react";

export class CanvasManager {
    private canvas;
    private color;
    private mousePosition;
    private baseWidth;
    private scale;

    private mouseDown = false;

    private ctx;
    private image;

    constructor(canvas: HTMLCanvasElement, color: number, baseWidth = 24, scale = 16) {
        this.canvas = canvas;
        this.color = color;
        this.baseWidth = baseWidth;
        this.scale = scale;

        this.ctx = canvas.getContext("2d")!;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.draw = this.draw.bind(this);

        canvas.addEventListener("mousemove", this.onMouseMove);
        canvas.addEventListener("mousedown", this.onMouseDown);
        canvas.addEventListener("mouseup", this.onMouseUp);
        canvas.addEventListener("mouseleave", this.onMouseUp);

        this.mousePosition = [0, 0] as [x: number, y: number];

        this.canvas.width = baseWidth * scale;
        this.canvas.height = baseWidth * scale;
        this.ctx.imageSmoothingEnabled = false;
        requestAnimationFrame(this.draw);

        this.image = Array.from(new Array(baseWidth), () =>
            Array.from(new Array(baseWidth), () =>
                0xFFFFFF
            )
        );
    }

    public setColor(color: number) {
        this.color = color;
    }

    public destroy() {
        this.canvas.removeEventListener("mousemove", this.onMouseMove);
        this.canvas.removeEventListener("mousedown", this.onMouseDown);
        this.canvas.removeEventListener("mouseup", this.onMouseUp);
        this.canvas.removeEventListener("mouseleave", this.onMouseUp);
    }

    protected onMouseMove(e: MouseEvent) {
        const position = [Math.floor(e.offsetX / this.scale), Math.floor(e.offsetY / this.scale)] as [x: number, y: number];

        if (position[0] < 0 || position[0] >= this.baseWidth || position[1] < 0 || position[1] >= this.baseWidth) {
            return;
        }

        if (this.mouseDown) {
            this.image[position[1]][position[0]] = this.color;
        }

        this.mousePosition = position;
    }

    protected onMouseDown(e: MouseEvent) {
        this.mouseDown = true;
    }

    protected onMouseUp(e: MouseEvent) {
        this.mouseDown = false;
    }

    protected draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let x = 0; x < this.baseWidth; x++) {
            for (let y = 0; y < this.baseWidth; y++) {
                this.ctx.fillStyle = `#${this.image[y][x].toString(16).padStart(6, "0")}`;
                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
            }
        }

        this.ctx.fillStyle = `#${this.color.toString(16).padStart(6, "0")}`;
        this.ctx.fillRect(this.mousePosition[0] * this.scale, this.mousePosition[1] * this.scale, this.scale, this.scale);

        requestAnimationFrame(this.draw);
    }
}