module.exports = {
  build(data){
    return {
      projectId: data.project.id,
      name: data.project.name,
      description: data.project.description,
      authorId: data.object_attributes.author_id,
    }
  }
}