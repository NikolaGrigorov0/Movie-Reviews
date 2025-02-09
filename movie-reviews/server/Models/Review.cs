using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class Review
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("userId")]
        public required string UserId { get; set; } 

         [BsonElement("movieId")]
        public required string MovieId { get; set; }  

        [BsonElement("description")]
        public required string Description { get; set; } 

        [BsonElement("rating")]
        public required double Rating { get; set; } 

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
    }
}
