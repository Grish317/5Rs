from django.core.management.base import BaseCommand
from users.models import LearningTrack, Lesson

class Command(BaseCommand):
    help = 'Seed initial learning tracks and lessons'

    def handle(self, *args, **kwargs):
        # Define your tracks and example videos
        tracks_data = [
            {
                'title': 'Life Skills',
                'category': 'life',
                'description': 'Essential life skills to improve well-being',
                'lessons': [
                    {
                        'title': 'First Aid Basics',
                        'youtube_id': '5OKFljZ2GQE',
                        'video_url': 'https://www.youtube.com/watch?v=5OKFljZ2GQE',
                        'thumbnail_url': 'https://i.ytimg.com/vi/5OKFljZ2GQE/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCjOQ_s6ZEPVat8eucNd6ZL7PMJDw',
                        'tags': 'first aid,health,safety',
                    },
                    {
                        'title': 'Nutrition for Children',
                        'youtube_id': 'ncorqVY',
                        'video_url': 'https://www.youtube.com/watch?v=tJ4-ncorqVY',
                        'thumbnail_url': 'https://i.ytimg.com/vi/tJ4-ncorqVY/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAbhtxIIP7rrvOpJqEb03WXKeI5Eg',
                        'tags': 'nutrition,children,health',
                    },
                    {
                        'title': 'Mental Wellness Tips',
                        'youtube_id': 'SBJ19oO8WDc',
                        'video_url': 'https://www.youtube.com/watch?v=SBJ19oO8WDc',
                        'thumbnail_url': 'https://i.ytimg.com/vi/SBJ19oO8WDc/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCL_Z3qSJ8wFeUoEvGYVou6ohzO8A',
                        'tags': 'mental health,wellness,mindfulness',
                    }
                ]
            },
            {
                'title': 'Income Skills',
                'category': 'income',
                'description': 'Skills to boost your income and livelihood',
                'lessons': [
                    {
                        'title': 'How to Make Pickles',
                        'youtube_id': 'LBvr0K-6NIY',
                        'video_url': 'https://www.youtube.com/watch?v=LBvr0K-6NIY',
                        'thumbnail_url': 'https://i.ytimg.com/vi/LBvr0K-6NIY/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLC_f0khh6uA3Qm0H-jsVaLerhRLXw',
                        'tags': 'pickles,cooking,food preservation',
                    },
                    {
                        'title': 'Soap Making Tutorial',
                        'youtube_id': 'lBc-dWQmFIM',
                        'video_url': 'https://www.youtube.com/watch?v=lBc-dWQmFIM',
                        'thumbnail_url': 'https://i.ytimg.com/vi/lBc-dWQmFIM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDPfuR4Grnz1plcRuxYlZd5bpiT_w',
                        'tags': 'soap making,handmade,crafts',
                    },
                    {
                        'title': 'How to Sew Clothes',
                        'youtube_id': 'EZngDWBk0xE',
                        'video_url': 'https://www.youtube.com/watch?v=EZngDWBk0xE',
                        'thumbnail_url': 'https://i.ytimg.com/vi/EZngDWBk0xE/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCALO66jeVext7qlA8_rVJEMoyGbw',
                        'tags': 'sewing,clothing',
                    }
                ]
            }
        ]

        for track_data in tracks_data:
            track, created = LearningTrack.objects.get_or_create(
                title=track_data['title'],
                category=track_data['category'],
                defaults={'description': track_data['description']}
            )
            if created:
                self.stdout.write(f'Created track: {track.title}')
            else:
                self.stdout.write(f'Track already exists: {track.title}')

            for lesson_data in track_data['lessons']:
                lesson, lcreated = Lesson.objects.get_or_create(
                    track=track,
                    title=lesson_data['title'],
                    defaults={
                        'youtube_id': lesson_data['youtube_id'],
                        'video_url': lesson_data['video_url'],
                        'thumbnail_url': lesson_data['thumbnail_url'],
                        'tags': lesson_data['tags'],
                    }
                )
                if lcreated:
                    self.stdout.write(f'  Created lesson: {lesson.title}')
                else:
                    self.stdout.write(f'  Lesson already exists: {lesson.title}')
