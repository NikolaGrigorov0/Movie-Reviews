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

        private double _starRating;

        [BsonElement("starRating")]
        public double StarRating
        {
            get => Math.Round(_starRating, 2);
            set => _starRating = Math.Round(value, 2);
        }

        [BsonElement("reviews")]
        public List<Review> Reviews { get; set; } = new List<Review>();
    }
}
