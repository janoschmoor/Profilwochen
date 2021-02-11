function renderFrame(){

    let deltaTime = clock.getDelta();

    updatePhysics( deltaTime );

    // var object = scene.getObjectByName( "ball" );
    // camera.lookAt(object.position);
    camera.lookAt(new THREE.Vector3(0,0,0));

    renderer.render( scene, camera );

    requestAnimationFrame( renderFrame );

}