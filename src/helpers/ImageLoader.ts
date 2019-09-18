import * as THREE from 'three/src/Three'

export default class ImageLoader {
    materials: Array<[number, THREE.MeshLambertMaterial]> = [];
    textures: Array<[number, THREE.Texture]> = [];
    manager: THREE.LoadingManager;
    i: number = 0;
    finished: boolean = false;

    constructor(public dataStream: Array<string>, public callback: any) {
        this.manager = new THREE.LoadingManager(this.Load, (a, b, c) => this.Progress(a, b, c), this.Error);
        dataStream.map(url => {
            let texture = new THREE.TextureLoader(this.manager).load(url, (texture) => {
                this.onLoad(texture, this.materials, url)
            });
        })
        console.log('Loaded');
        
    }

    onLoad(texture: THREE.Texture, materials: Array<[number, THREE.MeshLambertMaterial]>, url: string ) {
        console.log(url);
        let mat = new THREE.MeshLambertMaterial({ map: texture, transparent: true })        
        mat.needsUpdate = true;
        mat.onBeforeCompile = () => {
            console.log('Load Mat');            
        }
        this.textures.push([this.i, texture]);
        materials.push([this.i++, mat]);
    }


    Load() {
        console.log('Load');
    }

    Progress(url: string, loaded: any, total: any) {
        // console.log('Progress', loaded, total);
        if (loaded === total) {
            this.callback(true);
        }
    }

    Error() {
        console.log('Error');
    }
}