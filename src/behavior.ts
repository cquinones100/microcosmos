interface Behavior {
  call: <T extends {}>(args?: T) => void;
}

export default Behavior;
