using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public class Movie
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public required string Id { get; set; }

        [BsonElement("title")]
        public required string Title { get; set; }

        [BsonElement("description")]
        public required string Description { get; set; }

        [BsonElement("image")]
        public required string Image { get; set; }

        [BsonElement("starRating")]
        public int StarRating { get; set; }  // ⭐ Added Rating

        [BsonElement("review")]
        public string Review { get; set; }   // ✍️ Added Review
    }
}