const Filter = ({ filterName, handleFindName}) => (
  <div>
    find :
    <input value={filterName} onChange={handleFindName}/>
  </div>
)

export default Filter