const GAME_LEVELS = [
        {
                // Bölüm 1 (Öğretici / Test)
                strips: [
                        {
                                type: 'source', 
                                x: 100, y: 250, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0xFF0000,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'normal', 
                                x: 300, y: 260, 
                                width: 280, height: 80, 
                                expectedColor: 0xFF0000,
                                sockets: [
                                        { offsetX: 50, offsetY: 40 },
                                        { offsetX: 130, offsetY: 40 },
                                        { offsetX: 210, offsetY: 40 }
                                ]
                        }
                ]
        },
        {
                // Bölüm 2
                strips: [
                        {
                                type: 'source', 
                                x: 50, y: 350, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0xFF0000,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'normal', 
                                x: 200, y: 50, 
                                width: 80, height: 200, 
                                expectedColor: 0xFF0000,
                                sockets: [
                                        { offsetX: 40, offsetY: 50 },
                                        { offsetX: 40, offsetY: 130 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 350, y: 50, 
                                width: 80, height: 200, 
                                expectedColor: 0xFF0000,
                                sockets: [
                                        { offsetX: 40, offsetY: 50 },
                                        { offsetX: 40, offsetY: 130 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 180, y: 350, 
                                width: 280, height: 80, 
                                expectedColor: 0xFF0000,
                                sockets: [
                                        { offsetX: 50, offsetY: 40 },
                                        { offsetX: 130, offsetY: 40 },
                                        { offsetX: 210, offsetY: 40 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 500, y: 350, 
                                width: 150, height: 80, 
                                expectedColor: 0xFF0000,
                                sockets: [{ offsetX: 50, offsetY: 40 }]
                        }
                ]
        },
        {
                // Bölüm 3
                strips: [
                        {
                                type: 'source', 
                                x: 50, y: 250, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0xFF0000,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'normal', 
                                x: 250, y: 50, 
                                width: 150, height: 80, 
                                expectedColor: 0xFF0000,
                                sockets: [{ offsetX: 50, offsetY: 40 }]
                        },
                        {
                                type: 'normal', 
                                x: 450, y: 50, 
                                width: 150, height: 80, 
                                expectedColor: 0xFF0000,
                                sockets: [{ offsetX: 50, offsetY: 40 }]
                        },
                        {
                                type: 'normal', 
                                x: 250, y: 180, 
                                width: 80, height: 280, 
                                expectedColor: 0xFF0000,
                                sockets: [
                                        { offsetX: 40, offsetY: 50 },
                                        { offsetX: 40, offsetY: 130 },
                                        { offsetX: 40, offsetY: 210 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 450, y: 180, 
                                width: 80, height: 280, 
                                expectedColor: 0xFF0000,
                                sockets: [
                                        { offsetX: 40, offsetY: 50 },
                                        { offsetX: 40, offsetY: 130 },
                                        { offsetX: 40, offsetY: 210 }
                                ]
                        }
                ]
        },
        {
                // Bölüm 4
                strips: [
                        {
                                type: 'source', 
                                x: 150, y: 50, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0xFF0000,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'source', 
                                x: 500, y: 50, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0x0000FF,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'normal', 
                                x: 50, y: 200, 
                                width: 280, height: 80, 
                                expectedColor: 0xFF0000,
                                sockets: [
                                        { offsetX: 50, offsetY: 40 },
                                        { offsetX: 130, offsetY: 40 },
                                        { offsetX: 210, offsetY: 40 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 400, y: 200, 
                                width: 280, height: 80, 
                                expectedColor: 0x0000FF,
                                sockets: [
                                        { offsetX: 50, offsetY: 40 },
                                        { offsetX: 130, offsetY: 40 },
                                        { offsetX: 210, offsetY: 40 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 150, y: 350, 
                                width: 150, height: 80, 
                                expectedColor: 0x0000FF,
                                sockets: [{ offsetX: 50, offsetY: 40 }]
                        },
                        {
                                type: 'normal', 
                                x: 450, y: 350, 
                                width: 150, height: 80, 
                                expectedColor: 0xFF0000, 
                                sockets: [{ offsetX: 50, offsetY: 40 }]
                        }
                ]
        },
        {
                // Bölüm 5
                strips: [
                        {
                                type: 'source', 
                                x: 50, y: 200, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0xFF0000,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'source', 
                                x: 300, y: 300, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0x0000FF,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'normal', 
                                x: 240, y: 200, 
                                width: 280, height: 80, 
                                expectedColor: 0x000000,
                                sockets: [
                                        { offsetX: 50, offsetY: 40 },
                                        { offsetX: 130, offsetY: 40 },
                                        { offsetX: 210, offsetY: 40 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 600, y: 150, 
                                width: 150, height: 80, 
                                expectedColor: 0xFF00FF,
                                sockets: [{ offsetX: 50, offsetY: 40 }]
                        }
                ]
        },
        {
                // Bölüm 6
                strips: [
                        {
                                type: 'source', 
                                x: 50, y: 100, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0xFF0000,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'source', 
                                x: 350, y: 20, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0x00FF00,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'source', 
                                x: 650, y: 100, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0x0000FF,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'normal', 
                                x: 200, y: 200, 
                                width: 280, height: 80, 
                                expectedColor: 0xFFFFFF,
                                sockets: [
                                        { offsetX: 50, offsetY: 40 },
                                        { offsetX: 130, offsetY: 40 },
                                        { offsetX: 210, offsetY: 40 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 200, y: 350, 
                                width: 280, height: 80, 
                                expectedColor: 0xFFFFFF,
                                sockets: [
                                        { offsetX: 50, offsetY: 40 },
                                        { offsetX: 130, offsetY: 40 },
                                        { offsetX: 210, offsetY: 40 }
                                ]
                        }
                ]
        },
        {
                // Bölüm 7
                strips: [
                        {
                                type: 'source', 
                                x: 50, y: 200, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0xFF0000,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'source', 
                                x: 50, y: 400, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0x00FF00,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'source', 
                                x: 650, y: 250, 
                                width: 80, height: 100, 
                                expectedColor: 0x000000, 
                                color: 0x0000FF,
                                sockets: [{ offsetX: 40, offsetY: 40 }] 
                        },
                        {
                                type: 'normal', 
                                x: 250, y: 50, 
                                width: 280, height: 80, 
                                expectedColor: 0x000000,
                                sockets: [
                                        { offsetX: 50, offsetY: 40 },
                                        { offsetX: 130, offsetY: 40 },
					{ offsetX: 210, offsetY: 40 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 200, y: 200, 
                                width: 80, height: 280, 
                                expectedColor: 0xFFFFFF,
                                sockets: [
                                        { offsetX: 40, offsetY: 50 },
                                        { offsetX: 40, offsetY: 130 },
                                        { offsetX: 40, offsetY: 210 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 350, y: 200, 
                                width: 80, height: 200, 
                                expectedColor: 0x000000,
                                sockets: [
                                        { offsetX: 40, offsetY: 50 },
                                        { offsetX: 40, offsetY: 130 }
                                ]
                        },
                        {
                                type: 'normal', 
                                x: 500, y: 200, 
                                width: 80, height: 280, 
                                expectedColor: 0xFF0000,
                                sockets: [
                                        { offsetX: 40, offsetY: 50 },
                                        { offsetX: 40, offsetY: 130 },
                                        { offsetX: 40, offsetY: 210 }
                                ]
                        }
                ]
        }
];
