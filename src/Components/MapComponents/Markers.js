import React from 'react';

class Markers extends React.Component{
    render(){
        return(
            <g className="markers">
                {
                    !this.props.children?
                        null:
                        this.props.children.length===undefined?
                            React.cloneElement(this.props.children,{
                                projection:this.props.projection
                            }):
                            this.props.children.map((child,i)=>
                                !child ?
                                    null:
                                    React.cloneElement(child,{
                                        key:child.key || `marker-${i}`,
                                        projection:this.props.projection
                                    })
                            )
                }
            </g>
        );
    }
}


export default Markers;